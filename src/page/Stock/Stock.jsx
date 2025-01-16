import React from "react";
import { NavStock } from "./navStock";  // Corrected import (use correct case and path)
import { TableItem } from "./tableStock";  // Corrected import (use correct case and path)

export function StockItem() {
  return (
    <div className="bg-white h-full">
      <NavStock />
      {/* <TableItem /> */}
    </div>
  );
}
