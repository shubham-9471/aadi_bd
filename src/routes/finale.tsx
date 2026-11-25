import { createFileRoute } from "@tanstack/react-router";
import { FinalePage, birthdayHead } from "@/components/birthday/pages";
export const Route = createFileRoute("/finale")({
  head: () =>
    birthdayHead(
      "One last wish",
      "Light the candles, make a birthday wish, and open a letter from the heart.",
    ),
  component: FinalePage,
});
