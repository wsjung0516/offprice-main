import { Action, Selector, State, StateContext } from "@ngxs/store";
import { MenuUpdate, RegisterUpdate } from "./register.action";
import { Injectable } from "@angular/core";

export interface RegisterStateModel {
  status: {
    registerUpdate: boolean;
    menuUpdate: boolean;
  };
}
@State<RegisterStateModel>({
  name: 'register',
  defaults: {
    status: {
      registerUpdate: false,
      menuUpdate: false,
    }
  }
})
@Injectable()
export class RegisterState {
  @Selector()
  static getRegisterUpdate(state: RegisterStateModel) {
    return state.status.registerUpdate;
  }
  @Selector()
  static getMenuUpdate(state: RegisterStateModel) {
    return state.status.menuUpdate;
  }
  constructor(
  ) {}
  @Action(RegisterUpdate)
  registerUpdate({getState, patchState}: StateContext<RegisterStateModel>, {payload}: RegisterUpdate) {
    const state = getState();
    state.status.registerUpdate = !state.status.registerUpdate;
    patchState({...state});
  }
  @Action(MenuUpdate)
  menuUpdate({getState, patchState}: StateContext<RegisterStateModel>, {payload}: MenuUpdate) {
    // console.log('menuUpdate: ', payload);
    const state = getState();
    state.status.menuUpdate = !state.status.menuUpdate;
    // state.status['menuUpdate'] = payload;
    patchState({...state});
  }
}