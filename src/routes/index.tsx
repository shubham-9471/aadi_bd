import { createFileRoute } from "@tanstack/react-router";
import { InvitationPage, birthdayHead } from "@/components/birthday/pages";
export const Route = createFileRoute("/")({
  head: () =>
    birthdayHead(
      "Your secret invitation",
      "A birthday story in five little chapters. Someone made a little universe just for you.",
    ),
  component: InvitationPage,
});
