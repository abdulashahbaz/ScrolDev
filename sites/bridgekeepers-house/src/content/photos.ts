// Every photograph on the site, imported once so pages share the same
// optimised assets. Mostar scenes are composited from the scroll-story layers;
// hotel interiors are Unsplash photographs, graded to one look.

import diningBar from "@/assets/photos/dining-bar.jpg";
import diningChef from "@/assets/photos/dining-chef.jpg";
import diningPlate from "@/assets/photos/dining-plate.jpg";
import diningTable from "@/assets/photos/dining-table.jpg";
import diningWine from "@/assets/photos/dining-wine.jpg";
import mostarArch from "@/assets/photos/mostar-arch.jpg";
import mostarDuskArch from "@/assets/photos/mostar-dusk-arch.jpg";
import mostarDuskTown from "@/assets/photos/mostar-dusk-town.jpg";
import mostarTower from "@/assets/photos/mostar-tower.jpg";
import mostarTown from "@/assets/photos/mostar-town.jpg";
import roomBath from "@/assets/photos/room-bath.jpg";
import roomCourtyard from "@/assets/photos/room-courtyard.jpg";
import roomRiver from "@/assets/photos/room-river.jpg";
import roomTower from "@/assets/photos/room-tower.jpg";
import spaOil from "@/assets/photos/spa-oil.jpg";
import spaPour from "@/assets/photos/spa-pour.jpg";
import spaStones from "@/assets/photos/spa-stones.jpg";
import terraceView from "@/assets/photos/terrace-view.jpg";

export const photos = {
  diningBar,
  diningChef,
  diningPlate,
  diningTable,
  diningWine,
  mostarArch,
  mostarDuskArch,
  mostarDuskTown,
  mostarTower,
  mostarTown,
  roomBath,
  roomCourtyard,
  roomRiver,
  roomTower,
  spaOil,
  spaPour,
  spaStones,
  terraceView,
};

/** Unsplash photo IDs, for credits. Each is free to use under the Unsplash License. */
export const unsplashCredits: Record<string, string> = {
  roomRiver: "1611892440504-42a792e24d32",
  roomTower: "1578683010236-d716f9a3f461",
  roomCourtyard: "1590490360182-c33d57733427",
  roomBath: "1507652313519-d4e9174996dd",
  diningTable: "1414235077428-338989a2e8c0",
  diningPlate: "1467003909585-2f8a72700288",
  diningChef: "1551218808-94e220e084d2",
  diningWine: "1506377247377-2a5b3b417ebb",
  diningBar: "1514933651103-005eec06c04b",
  spaOil: "1515377905703-c4788e51af15",
  spaStones: "1600334129128-685c5582fd35",
  spaPour: "1544161515-4ab6ce6db874",
  terraceView: "1445019980597-93fa8acb246c",
};
