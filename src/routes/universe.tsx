import { createFileRoute } from "@tanstack/react-router";
import { UniversePage, birthdayHead } from "@/components/birthday/pages";
export const Route = createFileRoute("/universe")({
  head: () =>
    birthdayHead(
      "Your universe",
      "Today, the universe celebrates you. Explore five chapters of a very personal birthday surprise.",
    ),
  component: UniversePage,
});
