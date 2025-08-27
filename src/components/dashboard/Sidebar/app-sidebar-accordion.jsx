import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SidebarConfig from "./app-sidebar-config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AppSidebarAccordion = () => {
  const location = useLocation();

  // Separate dashboard and inventory items
  const dashboardItem = SidebarConfig.find(
    (item) => item.title === "Dashboard"
  );
  const inventoryItem = SidebarConfig.find(
    (item) => item.title === "Inventory"
  );
  const saleItem = SidebarConfig.find((item) => item.title === "Sale");
  const purchaseItem = SidebarConfig.find((item) => item.title === "Purchase");
  const stockItem = SidebarConfig.find((item) => item.title === "Stocks");
  const reportItem = SidebarConfig.find((item) => item.title === "Reports");
  const coaItem = SidebarConfig.find(
    (item) => item.title === "Charts of Accounts"
  );

  return (
    <>
      {/* Dashboard Link - Static */}
      {dashboardItem && (
        <div className="px-[15px] py-2">
          <Link
            to={dashboardItem.url}
            className={`flex items-center gap-[10px] ${
              location.pathname === dashboardItem.url
                ? "text-[#dea519] font-extrabold"
                : "text-[#939393]"
            }`}
          >
            <dashboardItem.icon className="w-5 h-5" />
            <span className="text-[16px] font-[600] leading-[20px]">
              {dashboardItem.title}
            </span>
          </Link>
        </div>
      )}
      
{/* Charts of Account */}
      {coaItem && (
        <div className="px-[15px] py-2">
          <Link
            to={coaItem.url}
            className={`flex items-center gap-[10px] ${
              location.pathname.includes("/coa")
                  ? "text-[#dea519] font-extrabold"
                  : "text-[#939393]"
              }`}
          >
            <coaItem.icon className="w-5 h-5" />
            <span className="text-[16px] font-[600] leading-[20px]">
              {coaItem.title}
            </span>
          </Link>
        </div>
      )}


      {/* Inventory Accordion */}
      {inventoryItem && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem className="border-none" value="inventory">
            <AccordionTrigger
              className={`hover:no-underline w-full px-[15px] ${
                location.pathname.includes("/inventory")
                  ? "text-[#dea519] font-extrabold"
                  : "text-[#939393]"
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <inventoryItem.icon className="w-5 h-5" />
                <span className="text-[16px] font-[600] leading-[20px]">
                  {inventoryItem.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {inventoryItem.items?.map((subItem) => (
                <NavLink
                  to={subItem.url}
                  key={subItem.title}
                  className={`block py-2 px-12 mt-2 p-3 rounded hover:bg-gray-100 ${
                    location.pathname.startsWith(subItem.url)
                      ? "bg-gray-200 text-[#dea519]"
                      : "text-[#939393]"
                  }`}
                >
                  {subItem.title}
                </NavLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {saleItem && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem className="border-none" value="sale">
            <AccordionTrigger
              className={`hover:no-underline w-full px-[15px] ${
                location.pathname.includes("/sale")
                  ? "text-[#dea519] font-extrabold"
                  : "text-[#939393]"
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <saleItem.icon className="w-5 h-5" />
                <span className="text-[16px] font-[600] leading-[20px]">
                  {saleItem.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {saleItem.items?.map((subItem) => (
                <NavLink
                  to={subItem.url}
                  key={subItem.title}
                  className={`block py-2 px-12 mt-2 p-3 rounded hover:bg-gray-100 ${
                    location.pathname.startsWith(subItem.url)
                      ? "bg-gray-200 text-[#dea519]"
                      : "text-[#939393]"
                  }`}
                >
                  {subItem.title}
                </NavLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {purchaseItem && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem className="border-none" value="purchase">
            <AccordionTrigger
              className={`hover:no-underline w-full px-[15px] ${
                location.pathname.includes("/purchase")
                  ? "text-[#dea519] font-extrabold"
                  : "text-[#939393]"
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <purchaseItem.icon className="w-5 h-5" />
                <span className="text-[16px] font-[600] leading-[20px]">
                  {purchaseItem.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {purchaseItem.items?.map((subItem) => (
                <NavLink
                  to={subItem.url}
                  key={subItem.title}
                  className={`block py-2 px-12 mt-2 p-3 rounded hover:bg-gray-100 ${
                    location.pathname.startsWith(subItem.url)
                      ? "bg-gray-200 text-[#dea519]"
                      : "text-[#939393]"
                  }`}
                >
                  {subItem.title}
                </NavLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {stockItem && (
        <div className="px-[15px] py-2">
          <Link
            to={stockItem.url}
            className={`flex items-center gap-[10px] ${
              location.pathname === stockItem.url
                ? "text-[#dea519] font-extrabold"
                : "text-[#939393]"
            }`}
          >
            <stockItem.icon className="w-5 h-5" />
            <span className="text-[16px] font-[600] leading-[20px]">
              {stockItem.title}
            </span>
          </Link>
        </div>
      )}

      {reportItem && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem className="border-none" value="reports">
            <AccordionTrigger
              className={`hover:no-underline w-full px-[15px] ${
                location.pathname.includes("/reports")
                  ? "text-[#dea519] font-extrabold"
                  : "text-[#939393]"
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <reportItem.icon className="w-5 h-5" />
                <span className="text-[16px] font-[600] leading-[20px]">
                  {reportItem.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {reportItem.items?.map((subItem) => (
                <NavLink
                  to={subItem.url}
                  key={subItem.title}
                  className={`block py-2 px-12 mt-2 p-3 rounded hover:bg-gray-100 ${
                    location.pathname.startsWith(subItem.url)
                      ? "bg-gray-200 text-[#dea519]"
                      : "text-[#939393]"
                  }`}
                >
                  {subItem.title}
                </NavLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      
    </>
  );
};

export default AppSidebarAccordion;
