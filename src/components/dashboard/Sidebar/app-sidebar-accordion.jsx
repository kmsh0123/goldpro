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
  const expenseItem = SidebarConfig.find(
    (item) => item.title === "Expenses"
  );
  const incomeItem = SidebarConfig.find(
    (item) => item.title === "Incomes"
  );
  const inventoryItem = SidebarConfig.find(
    (item) => item.title === "Inventory"
  );
  const saleItem = SidebarConfig.find((item) => item.title === "Sale");
  const purchaseItem = SidebarConfig.find((item) => item.title === "Purchase");
  const DamageItem = SidebarConfig.find((item) => item.title === "Damage");
  const ProductReturnItem = SidebarConfig.find((item) => item.title === "Product Return");
  const stockItem = SidebarConfig.find((item) => item.title === "Stocks");
  const reportItem = SidebarConfig.find((item) => item.title === "Reports");
  const paymentItem = SidebarConfig.find(
    (item) => item.title === "Payments"
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


        {/* Payment */}

       {paymentItem && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem className="border-none" value="payment">
            <AccordionTrigger
              className={`hover:no-underline w-full px-[15px] ${
                location.pathname.includes("/payment")
                  ? "text-[#dea519] font-extrabold"
                  : "text-[#939393]"
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <paymentItem.icon className="w-5 h-5" />
                <span className="text-[16px] font-[600] leading-[20px]">
                  {paymentItem.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {paymentItem.items?.map((subItem) => (
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
    

      {/* Expense Accordion */}

       {expenseItem && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem className="border-none" value="expense">
            <AccordionTrigger
              className={`hover:no-underline w-full px-[15px] ${
                location.pathname.includes("/expense")
                  ? "text-[#dea519] font-extrabold"
                  : "text-[#939393]"
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <expenseItem.icon className="w-5 h-5" />
                <span className="text-[16px] font-[600] leading-[20px]">
                  {expenseItem.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {expenseItem.items?.map((subItem) => (
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

      {/* Income Accordion */}

       {incomeItem && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem className="border-none" value="income">
            <AccordionTrigger
              className={`hover:no-underline w-full px-[15px] ${
                location.pathname.includes("/income")
                  ? "text-[#dea519] font-extrabold"
                  : "text-[#939393]"
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <incomeItem.icon className="w-5 h-5" />
                <span className="text-[16px] font-[600] leading-[20px]">
                  {incomeItem.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {incomeItem.items?.map((subItem) => (
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

      {DamageItem && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem className="border-none" value="damage">
            <AccordionTrigger
              className={`hover:no-underline w-full px-[15px] ${
                location.pathname.includes("/damage")
                  ? "text-[#dea519] font-extrabold"
                  : "text-[#939393]"
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <DamageItem.icon className="w-5 h-5" />
                <span className="text-[16px] font-[600] leading-[20px]">
                  {DamageItem.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {DamageItem.items?.map((subItem) => (
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

      {ProductReturnItem && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem className="border-none" value="return">
            <AccordionTrigger
              className={`hover:no-underline w-full px-[15px] ${
                location.pathname.includes("/return")
                  ? "text-[#dea519] font-extrabold"
                  : "text-[#939393]"
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <ProductReturnItem.icon className="w-5 h-5" />
                <span className="text-[16px] font-[600] leading-[20px]">
                  {ProductReturnItem.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {ProductReturnItem.items?.map((subItem) => (
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
