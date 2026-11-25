import { createFileRoute } from "@tanstack/react-router";
import { MemoriesPage, birthdayHead } from "@/components/birthday/pages";
export const Route = createFileRoute("/memories")({
  head: () =>
    birthdayHead(
      "Gallery & Vibes",
      "Abeyy aab itnii bhii jyada tareef nii krr skta maii teri",
    ),
  component: MemoriesPage,
});
