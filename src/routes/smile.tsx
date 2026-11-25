import { createFileRoute } from "@tanstack/react-router";
import { SmilePage, birthdayHead } from "@/components/birthday/pages";
export const Route = createFileRoute("/smile")({
  head: () =>
    birthdayHead(
      "Reasons to smile",
      "Things that make you, you. Discover love notes, little secrets, and a personal birthday quiz.",
    ),
  component: SmilePage,
});
