describe('Dashboard application', () => {
  it('Should load the dashboard homepage', () => {
    cy.visit('/')

    cy.contains(/dashboard/)
    cy.contains('Refresh').click()
    cy.contains(/dashboard/)
  })
})
