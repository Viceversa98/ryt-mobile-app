import { Screen } from "@/components/Screen";
import { AppMenuContent } from "@/navigation/AppMenuContent";

export default function MenuRoute() {
  return (
    <Screen edges={["left", "right", "bottom"]}>
      <AppMenuContent />
    </Screen>
  );
}
