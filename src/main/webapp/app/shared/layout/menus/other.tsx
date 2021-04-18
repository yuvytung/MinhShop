import React from "react";
import MenuItem from "app/shared/layout/menus/menu-item";
import {NavDropdown} from "app/shared/layout/menus/menu-components";

export const Other = props => (
  <NavDropdown name="Other">
    <MenuItem icon="asterisk" to="/chat">
      Chat
    </MenuItem>
  </NavDropdown>
);