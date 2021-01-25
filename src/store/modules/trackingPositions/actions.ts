import {
  LOAD_POSITIONS_ACTION,
  CLEAR_POSITIONS_MUTATION,
  ADD_POSITIONS_MUTATION,
  LOAD_CURRENT_POSITION_MUTATION, 
  CLEAR_CURRENT_POSITION_MUTATION,
  LOAD_CURRENT_POSITION_ACTION,
  ADD_POSITIONS_ACTION
} from "@/store/modules/trackingPositions/constants";
import { ActionContext } from "vuex";
import { TrackingPositionsService } from "@/services/tracking_positions_service";
import { VuexTrackingPositionsStateInterface, VuexTrackingPositionsStateGroupItemInterface } from "@/store/modules/trackingPositions/index";

export const actions = {
  async [LOAD_POSITIONS_ACTION](context: ActionContext<VuexTrackingPositionsStateGroupItemInterface, any>) {
    const service = new TrackingPositionsService();
    const positions = await service.getUserPositions();

    context.commit(CLEAR_POSITIONS_MUTATION);

    console.log(positions)

    positions.forEach((item: any) => {
      context.commit(ADD_POSITIONS_MUTATION, item);
    })
  },

  async [LOAD_CURRENT_POSITION_ACTION](context: ActionContext<VuexTrackingPositionsStateGroupItemInterface, any>, articul: string) {
    const service = new TrackingPositionsService();
    const position = await service.getPosition(articul);

    context.commit(CLEAR_CURRENT_POSITION_MUTATION, articul);
    
    position.forEach((item: any) => {
      context.commit(LOAD_CURRENT_POSITION_MUTATION, {item: item, articul: articul});
    })
  },

  async [ADD_POSITIONS_ACTION](context: ActionContext<VuexTrackingPositionsStateGroupItemInterface, any>, articules: Array<string>) {
    const service = new TrackingPositionsService();
    const result = await service.setPositions(articules);
    return result
  }
};