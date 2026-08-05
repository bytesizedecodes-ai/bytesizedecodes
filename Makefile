# Makefile — entry points for local dev (Next.js + Convex).
# Targets are documented by `make help`.
#
# Common:
# - `make` / `make help` ........ list everything
# - `make up` ................... start Next + Convex detached + open browser
# - `make dev` ................. foreground Next + Convex (run in a terminal)
# - `make restart` ............. stop + start detached dev servers
# - `make stop` ................ stop all detached dev processes
# - `make status` .............. show ports + PIDs + Convex deployment
# - `make db-info` ............. list Convex dev tables and row counts
# - `make prod` ................ show prod deploy info (does NOT deploy)
# - `make prod-apply` .......... actually deploy Convex to prod

# ----------------------------------------------------------------------------
# Config (override with `make target VAR=value` or env vars)
# ----------------------------------------------------------------------------
PORT          ?= 3000
# Auto-open the app in the browser when `make up` freshly starts the server.
# Set OPEN_BROWSER=false to disable (e.g. `make up OPEN_BROWSER=false`).
OPEN_BROWSER  ?= true
WORKDIR       ?= $(CURDIR)
ZCODE_DIR     ?= $(WORKDIR)/.zcode
LOG_DIR       ?= $(ZCODE_DIR)/logs
PID_DIR       ?= $(ZCODE_DIR)/pids

NEXT_PID      := $(PID_DIR)/next.pid
CONVEX_PID    := $(PID_DIR)/convex.pid
NEXT_LOG      := $(LOG_DIR)/next.log
CONVEX_LOG    := $(LOG_DIR)/convex.log

# Resolve nvm so npm/node are on PATH in non-interactive shells.
NVM_DIR       ?= $(HOME)/.nvm

# Colors
BLUE          := \033[34m
GREEN         := \033[32m
YELLOW        := \033[33m
RED           := \033[31m
RESET         := \033[0m

.DEFAULT_GOAL := help
.PHONY: help dev up stop restart status logs db-info dashboard open prod prod-apply typecheck test build clean

# ----------------------------------------------------------------------------
# Help (default target) — parsed from "## " comments
# ----------------------------------------------------------------------------
help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make \033[36m<target>\033[0m\n\n"} \
	/^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# ----------------------------------------------------------------------------
# Internal — load nvm, ensure log/pid dirs
# ----------------------------------------------------------------------------
# Sourced at the top of each recipe via "NVM_LOAD; <rest>".
NVM_LOAD := [ -s "$(NVM_DIR)/nvm.sh" ] && . "$(NVM_DIR)/nvm.sh" >/dev/null 2>&1; true

_pid-dirs:
	@mkdir -p $(LOG_DIR) $(PID_DIR)

# ----------------------------------------------------------------------------
# Foreground dev — run in a terminal; Ctrl-C stops both
# ----------------------------------------------------------------------------
dev: _pid-dirs ## Start Next + Convex in the foreground (blocking)
	@printf "$(BLUE)==> Starting Next (:%s) + Convex dev (foreground)$(RESET)\n" "$(PORT)"
	@$(NVM_LOAD); \
	trap 'kill 0' INT; \
	npx convex dev > $(CONVEX_LOG) 2>&1 & \
	echo $$! > $(CONVEX_PID); \
	npx next dev --port $(PORT); \
	kill $$CONVEX_PID 2>/dev/null || true; \
	rm -f $(CONVEX_PID)

# ----------------------------------------------------------------------------
# Detached launcher — start Next + Convex in the background + open the browser
# ----------------------------------------------------------------------------
up: _pid-dirs ## Start Next + Convex detached and open the app in the browser
	@$(NVM_LOAD); \
	NEXT_FRESH=no; \
	if [ -f $(NEXT_PID) ] && kill -0 $$(cat $(NEXT_PID) 2>/dev/null) 2>/dev/null; then \
	  printf "$(GREEN)next already running (pid %s)$(RESET)\n" "$$(cat $(NEXT_PID))"; \
	elif lsof -iTCP:$(PORT) -sTCP:LISTEN -P -n >/dev/null 2>&1; then \
	  printf "$(YELLOW):$(PORT) already in use — assuming Next is up$(RESET)\n"; \
	else \
	  nohup npx next dev --port $(PORT) > $(NEXT_LOG) 2>&1 & \
	  echo $$! > $(NEXT_PID); disown 2>/dev/null || true; \
	  NEXT_FRESH=yes; \
	  printf "$(GREEN)next starting (pid %s) on :$(PORT)$(RESET)\n" "$$(cat $(NEXT_PID))"; \
	fi; \
	if [ -f $(CONVEX_PID) ] && kill -0 $$(cat $(CONVEX_PID) 2>/dev/null) 2>/dev/null; then \
	  printf "$(GREEN)convex already running (pid %s)$(RESET)\n" "$$(cat $(CONVEX_PID))"; \
	else \
	  nohup npx convex dev > $(CONVEX_LOG) 2>&1 & \
	  echo $$! > $(CONVEX_PID); disown 2>/dev/null || true; \
	  printf "$(GREEN)convex dev starting (pid %s)$(RESET)\n" "$$(cat $(CONVEX_PID))"; \
	fi; \
	if [ "$$NEXT_FRESH" = "yes" ] && [ "$(OPEN_BROWSER)" = "true" ]; then \
	  printf "$(BLUE)==> waiting for Next on :$(PORT) before opening browser…$(RESET)\n"; \
	  for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do \
	    lsof -iTCP:$(PORT) -sTCP:LISTEN -P -n >/dev/null 2>&1 && break; \
	    sleep 1; \
	  done; \
	  if lsof -iTCP:$(PORT) -sTCP:LISTEN -P -n >/dev/null 2>&1; then \
	    URL="http://localhost:$(PORT)"; \
	    open "$$URL" 2>/dev/null || xdg-open "$$URL" 2>/dev/null || true; \
	    printf "$(GREEN)==> opened %s in browser$(RESET)\n" "$$URL"; \
	  else \
	    printf "$(YELLOW)Next didn't bind :$(PORT) in 15s — not opening browser. See $(NEXT_LOG)$(RESET)\n"; \
	  fi; \
	fi

# ----------------------------------------------------------------------------
# Stop / restart
# ----------------------------------------------------------------------------
stop: ## Stop Next + Convex dev processes
	@$(NVM_LOAD); \
	for f in $(NEXT_PID) $(CONVEX_PID); do \
	  if [ -f "$$f" ] && kill -0 $$(cat "$$f" 2>/dev/null) 2>/dev/null; then \
	    kill $$(cat "$$f") 2>/dev/null || true; \
	    printf "$(GREEN)stopped %s (pid %s)$(RESET)\n" "$$(basename $$f .pid)" "$$(cat $$f)"; \
	  fi; \
	  rm -f "$$f"; \
	done; \
	if lsof -iTCP:$(PORT) -sTCP:LISTEN -P -n >/dev/null 2>&1; then \
	  lsof -tiTCP:$(PORT) -sTCP:LISTEN | xargs kill 2>/dev/null || true; \
	  printf "$(YELLOW)killed leftover process on :$(PORT)$(RESET)\n"; \
	fi; \
	printf "$(GREEN)==> dev processes stopped$(RESET)\n"

restart: ## Restart Next + Convex (detached)
	@$(MAKE) --no-print-directory stop
	@sleep 1
	@$(MAKE) --no-print-directory up

# ----------------------------------------------------------------------------
# Observability
# ----------------------------------------------------------------------------
status: ## Show ports, PIDs, and Convex dev deployment name
	@printf "$(BLUE)==> Dev servers$(RESET)\n"
	@$(NVM_LOAD); \
	if [ -f $(NEXT_PID) ] && kill -0 $$(cat $(NEXT_PID) 2>/dev/null) 2>/dev/null; then \
	  printf "  next:   $(GREEN)running$(RESET) (pid %s, :$(PORT))\n" "$$(cat $(NEXT_PID))"; \
	elif lsof -iTCP:$(PORT) -sTCP:LISTEN -P -n >/dev/null 2>&1; then \
	  printf "  next:   $(YELLOW):$(PORT) busy by another process$(RESET)\n"; \
	else \
	  printf "  next:   $(RED)stopped$(RESET)\n"; \
	fi; \
	if [ -f $(CONVEX_PID) ] && kill -0 $$(cat $(CONVEX_PID) 2>/dev/null) 2>/dev/null; then \
	  printf "  convex: $(GREEN)running$(RESET) (pid %s)\n" "$$(cat $(CONVEX_PID))"; \
	else \
	  printf "  convex: $(RED)stopped$(RESET)\n"; \
	fi; \
	printf "\n$(BLUE)==> Convex dev deployment$(RESET)\n"; \
	if [ -f .env.local ] && grep -q '^CONVEX_DEPLOYMENT=' .env.local; then \
	  grep '^CONVEX_DEPLOYMENT=' .env.local | sed 's/^/  /'; \
	  grep '^NEXT_PUBLIC_CONVEX_URL=' .env.local | sed 's/^/  /'; \
	else \
	  printf "  $(YELLOW)CONVEX_DEPLOYMENT not set in .env.local$(RESET)\n"; \
	fi

logs: ## Tail Next + Convex logs (Ctrl-C to exit; servers keep running)
	@printf "$(BLUE)==> Tailing logs (Ctrl-C to exit; servers keep running)$(RESET)\n"
	@tail -F $(NEXT_LOG) $(CONVEX_LOG) 2>/dev/null || printf "$(YELLOW)no logs yet — run make dev or make restart first$(RESET)\n"

# ----------------------------------------------------------------------------
# Convex database info + dashboard
# ----------------------------------------------------------------------------
db-info: ## List Convex dev tables (and row counts via npx convex data)
	@$(NVM_LOAD); \
	printf "$(BLUE)==> Convex dev database tables$(RESET)\n"; \
	if [ -f .env.local ] && grep -q '^CONVEX_DEPLOYMENT=' .env.local; then \
	  grep '^CONVEX_DEPLOYMENT=' .env.local | sed 's/^/Deployment: /'; \
	fi; \
	printf "\n"; \
	TABLES=$$(npx convex data 2>/dev/null); \
	if [ -z "$$TABLES" ]; then \
	  printf "$(YELLOW)could not reach Convex — is convex dev running? try: make restart$(RESET)\n"; \
	else \
	  printf "%s\n" "$$TABLES" | while read -r t; do \
	    [ -z "$$t" ] && continue; \
	    COUNT=$$(npx convex data "$$t" --format json 2>/dev/null | python3 -c "import sys,json;print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?"); \
	    printf "  %-20s %s rows\n" "$$t" "$$COUNT"; \
	  done; \
	fi

dashboard: ## Open the Convex dashboard in your browser
	@$(NVM_LOAD); npx convex dashboard

open: ## Open the dev app (http://localhost:PORT) in the browser
	@URL="http://localhost:$(PORT)"; \
	if ! lsof -iTCP:$(PORT) -sTCP:LISTEN -P -n >/dev/null 2>&1; then \
	  printf "$(YELLOW):$(PORT) not listening — start the server first: make _hook-start$(RESET)\n"; \
	  exit 1; \
	fi; \
	open "$$URL" 2>/dev/null || xdg-open "$$URL" 2>/dev/null || true; \
	printf "$(GREEN)==> opened %s$(RESET)\n" "$$URL"

# ----------------------------------------------------------------------------
# Prod sync (guarded) — Convex deploy
# ----------------------------------------------------------------------------
prod: ## Show prod deploy target + instructions (does NOT deploy)
	@printf "$(BLUE)==> Convex prod deploy — info only (nothing is pushed)$(RESET)\n"
	@printf "This target deliberately does not run 'convex deploy'.\n\n"
	@if [ -f .env.local ] && grep -q '^CONVEX_DEPLOYMENT=' .env.local; then \
	  grep '^CONVEX_DEPLOYMENT=' .env.local | sed 's/^/  dev  deployment: /'; \
	  printf "  prod deployment: bytesize-decodes:bytesizedecodes:production\n"; \
	  printf "  (run 'npx convex deploy' or 'make prod-apply' to push)\n"; \
	else \
	  printf "  $(YELLOW)CONVEX_DEPLOYMENT not set in .env.local$(RESET)\n"; \
	fi
	@printf "\nTo actually push: $(BLUE)make prod-apply$(RESET)\n"

prod-apply: ## ACTUALLY deploy Convex to prod (asks for confirmation)
	@$(NVM_LOAD); \
	if [ -f .env.local ] && grep -q '^CONVEX_DEPLOYMENT=' .env.local; then \
	  DEP=$$(grep '^CONVEX_DEPLOYMENT=' .env.local | cut -d= -f2); \
	  printf "$(RED)==> ABOUT TO DEPLOY TO PROD: %s$(RESET)\n" "$$DEP"; \
	fi; \
	printf "Type 'yes' to continue: "; read REPLY; \
	[ "$$REPLY" = "yes" ] || { printf "$(YELLOW)aborted.$(RESET)\n"; exit 1; }; \
	npx convex deploy; \
	printf "$(GREEN)==> Deploy complete.$(RESET)\n"

# ----------------------------------------------------------------------------
# Pass-through checks / build
# ----------------------------------------------------------------------------
typecheck: ## Run tsc --noEmit
	@$(NVM_LOAD); npx tsc --noEmit

test: ## Run vitest once
	@$(NVM_LOAD); npx vitest run

build: ## Production build (next build)
	@$(NVM_LOAD); npx next build

clean: ## Remove dev artifacts (logs, pids) — does NOT touch node_modules
	@rm -rf $(LOG_DIR) $(PID_DIR)
	@printf "$(GREEN)==> cleaned .zcode/logs and .zcode/pids$(RESET)\n"
