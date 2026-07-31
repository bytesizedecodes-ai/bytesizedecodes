import { redirect } from "next/navigation";

/** Courses hub moved into Learn. Deep links under `/courses/*` still work. */
export default function CoursesHubPage() {
  redirect("/learn");
}
