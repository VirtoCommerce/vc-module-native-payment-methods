import * as blades from "./pages";
import * as locales from "./locales";
import { defineAppModule } from "@vc-shell/framework";

// Non-integrative payment methods: the AngularJS module's list (main menu), details and logo widget (now a field of the details)
export default defineAppModule({
  blades,
  locales,
});
