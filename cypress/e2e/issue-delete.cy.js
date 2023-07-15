describe('Issue delete', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
      // Assert that issue detail view modal is visible
      cy.get('[data-testid="modal:issue-details"]').should('be.visible');
  
      });
      
    });
    //decleraing selectors as variables
    const issuedeleteSelectors = {
        deleteIconTrash: '[data-testid="icon:trash"]',
        deleteBacklog: '[data-testid="board-list:backlog"]',
        deleteModelConfirm: '[data-testid="modal:confirm"]'
    }

    //Test 1

    it('Should delete issue successfully', () => {
        cy.get(issuedeleteSelectors.deleteIconTrash).click();
        cy.get(issuedeleteSelectors.deleteModelConfirm)
          .should('be.visible').contains('Are you sure you want to delete this issue?');
        cy.get(issuedeleteSelectors.deleteModelConfirm).find('button').contains('Delete issue').click();

        //Assert, that deletion confirmation dialogue is not visible.
        cy.get(issuedeleteSelectors.deleteModelConfirm).should('not.exist');

        cy.reload();
        //Assert, that issue is deleted and not displayed on the Jira board anymore.
        cy.get(issuedeleteSelectors.deleteBacklog).should('be.visible').and('have.length', '1').within(() => {
           cy.contains('This is an issue of type: Task.').should('not.exist');
        });

    });

    //Test 2

    it('Should cancel deletion process successfully', () => {
        cy.get(issuedeleteSelectors.deleteIconTrash).click();
        cy.get(issuedeleteSelectors.deleteModelConfirm)
          .should('be.visible').contains('Are you sure you want to delete this issue?')
        cy.get(issuedeleteSelectors.deleteModelConfirm).find('button').contains('Cancel').click();

        //Assert, that deletion confirmation dialogue is not visible.
        cy.get(issuedeleteSelectors.deleteModelConfirm).should('not.exist');

        //close the issue dialogue 
        cy.get('[data-testid="icon:close"]').first().click();

        cy.reload();
        //assert that the issue is not deleted and still displayed on jira board
        cy.get(issuedeleteSelectors.deleteBacklog).contains('This is an issue of type: Task.').should('exist');

    });

});