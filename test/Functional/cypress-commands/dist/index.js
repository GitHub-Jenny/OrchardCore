'use strict';

Cypress.Commands.add("login", function({ prefix = ""}={}) {
  const config = Cypress.config('orchard');
  cy.visit(`${prefix}/login`);
  cy.get("#UserName").type(config.username);
  cy.get("#Password").type(config.password);
  cy.get("#UserName").closest('form').submit();
});

Cypress.Commands.add("visitTenantSetupPage", ({ name }) => {
  cy.visit("/Admin/Tenants");
  cy.get(`#btn-setup-${name}`).click();
});

Cypress.Commands.add("siteSetup",  ({ name, setupRecipe }) => {
  const config = Cypress.config('orchard');
  cy.get("#SiteName").type(name);
  cy.get("body").then($body => {
    const elem = $body.find("#RecipeName");
    if (elem) {
      elem.val(setupRecipe);
    }
    const db = $body.find("#DatabaseProvider");
    if (db) {
      db.val("Sqlite");
    }
  });
  cy.get("#UserName").type(config.username);
  cy.get("#Email").type(config.email);
  cy.get("#Password").type(config.password);
  cy.get("#PasswordConfirmation").type(config.password);
  cy.get("#SubmitButton").click();
});
Cypress.Commands.add('newTenant', function(tenantInfo) {
  cy.login();
  cy.createTenant(tenantInfo);
  cy.visitTenantSetupPage(tenantInfo);
  cy.siteSetup(tenantInfo);
});

Cypress.Commands.add("createTenant", ({ name, prefix, setupRecipe, description }) => {
  // We create tenants on the SaaS tenant
  cy.visit("/Admin/Tenants");
  cy.btnCreateClick();
  cy.get("#Name").type(name, {force:true});
  cy.get("#Description").type(`Recipe: ${setupRecipe}. ${description || ''}`, {force:true});
  cy.get("#RequestUrlPrefix").type(prefix, {force:true});
  cy.get("#RecipeName").select(setupRecipe);
  cy.get("#DatabaseProvider").select('Sqlite');
  cy.btnCreateClick();
});

Cypress.Commands.add("runRecipe", ({ prefix }, recipeName) => {
  cy.visit(`${prefix}/Admin/Recipes`);
  cy.get(`#btn-run-${recipeName}`).click();
  cy.btnModalOkClick();
});

Cypress.Commands.add("uploadRecipeJson", ({ prefix }, fixturePath) => {
  cy.fixture(fixturePath).then((data) => {
    cy.visit(`${prefix}/Admin/DeploymentPlan/Import/Json`);
    cy.get('#Json').invoke('val', JSON.stringify(data)).trigger('input',{force: true});
    cy.get('.ta-content > form').submit();
    // make sure the message-success alert is displayed
    cy.get('.message-success').should('contain', "Recipe imported");
  });
});

function byCy(id, exact) {
  if (exact) {
    return `[data-cy="${id}"]`;
  }
  return `[data-cy^="${id}"]`;
}

Cypress.Commands.add('getByCy', (selector, exact = false) => {
  return cy.get(byCy(selector, exact));
});

Cypress.Commands.add(
  'findByCy',
  {prevSubject: 'optional'},
  (subject, selector, exact = false) => {
    return subject
      ? cy.wrap(subject).find(byCy(selector, exact))
      : cy.find(byCy(selector, exact));
  },
);

Cypress.Commands.add("setPageSize", ({prefix = ""}, size) => {
  cy.visit(`${prefix}/Admin/Settings/general`);
  cy.get('#ISite_PageSize')
    .clear()
    .type(size);
  cy.btnSaveClick();
  // wait until the success message is displayed
  cy.get('.message-success');
});

Cypress.Commands.add("enableFeature", ({ prefix }, featureName) => {
  cy.visit(`${prefix}/Admin/Features`);
  cy.get(`#btn-enable-${featureName}`).click();
});

Cypress.Commands.add("diableFeature", ({ prefix }, featureName) => {
  cy.visit(`${prefix}/Admin/Features`);
  cy.get(`#btn-diable-${featureName}`).click();
});

Cypress.Commands.add("visitContentPage", ({ prefix }, contentItemId) => {
  cy.visit(`${prefix}/Contents/ContentItems/${contentItemId}`);
});

Cypress.Commands.add('btnCreateClick', function() {
  cy.get('.btn.create').click();
});

Cypress.Commands.add('btnSaveClick', function() {
  cy.get('.btn.save').click();
});
Cypress.Commands.add('btnSaveContinueClick', function() {
  cy.get('.dropdown-item.save-continue').click();
});

Cypress.Commands.add('btnCancelClick', function() {
  cy.get('.btn.cancel').click();
});

Cypress.Commands.add('btnPublishClick', function() {
  cy.get('.btn.public').click();
});
Cypress.Commands.add('btnPublishContinueClick', function() {
  cy.get('.dropdown-item.publish-continue').click();
});

Cypress.Commands.add('btnModalOkClick', function() {
  cy.get("#modalOkButton").click();
});
