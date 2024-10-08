/// <reference types="cypress" />

import { homePage } from "../pages/HomePage";
import { registryPage } from "../pages/RegistryPage";
import { catalogSearch } from "../pages/CatalogSearch";

describe("template spec", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  beforeEach("Open Main page", () => {
    homePage.openHomePage();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  });

  afterEach("ClearData", () => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
  });

  it("User Registration and Login", () => {
    homePage.checkIfUrlIsCorrect("https://magento.softwaretestingboard.com/");
    homePage.checkIfTitlePageIsCorrect("Home Page");
    homePage.selectHeaderLink("Create an Account");
    registryPage.checkIfUrlPathIsCorrect("/customer/account/create/");
    registryPage.checkIfElementIsDisplayed(registryPage.pageTitleWrapper);
    registryPage.fillTheRegistryFormRandom();
    registryPage.checkIfPasswordStrengthIsNotWeak();
    registryPage.clickButton(registryPage.buttonTitle);
    registryPage.checkIfUrlPathIsCorrect("/customer/account/");
    registryPage.checkIfElementConatinsCorrectText(
      registryPage.pageMessages,
      "Thank you for registering with Main Website Store."
    );
    registryPage.clickButton(registryPage.logo);
    homePage.checkIfUrlIsCorrect("https://magento.softwaretestingboard.com/");
    homePage.checkIfElementIsDisplayed(homePage.loggedIn);
  });

  it("Product Search and Filter", () => {
    homePage.searchProduct("Bolo Sport");
    catalogSearch.checkIfUrlPathIsCorrect("/catalogsearch/result/");
    catalogSearch.selectFilter("Gear");
    catalogSearch.checkIfElementConatinsCorrectText(
      catalogSearch.filterValue,
      "Gear"
    );
    catalogSearch.checkIfProductIsOnItemList("Bolo Sport");
  });

  it("Adding Items to Cart", () => {
    homePage.searchProduct("Bolo Sport");
    catalogSearch.selectFilter("Gear");
    catalogSearch.selectProduct("Bolo Sport");
    catalogSearch.catchRequest("POST", "**/product/42/", "request");
    catalogSearch.clickButton(catalogSearch.buttonAddToCart);
    catalogSearch.waitForServiceResponse("request");
    catalogSearch.checkIfElementConatinsCorrectNumber(
      catalogSearch.basketcounterNumber,
      1
    );
    catalogSearch.checkIfElementIsDisplayed(
      catalogSearch.infoAboutAddedIntoBasket
    );
    catalogSearch.checkIfProductNameFromBasketIsTheSameAsAdded();
  });
});
