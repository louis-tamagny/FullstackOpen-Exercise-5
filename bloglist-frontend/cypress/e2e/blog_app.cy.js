describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      password: 'motdepasse', username: 'ltamagny', name: 'Louis Tamagny'
    })
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.get('#loginForm').should('exist')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#usernameInput').type('ltamagny')
      cy.get('#passwordInput').type('motdepasse')
      cy.get('#loginFormSubmit').click()

      cy.get('#notification').should('contain', 'Login successful')
      cy.get('#loginForm').should('not.exist')
    })

    it('fails with wrong credentials', function() {
      cy.get('#usernameInput').type('wrong username')
      cy.get('#passwordInput').type('motdepasse')
      cy.get('#loginFormSubmit').click()

      cy.get('#notification').should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('#loginForm').should('exist')
    })
  })
})