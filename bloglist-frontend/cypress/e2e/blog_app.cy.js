describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      password: 'motdepasse', username: 'ltamagny', name: 'Louis Tamagny'
    })
    cy.request('POST', 'http://localhost:3003/api/users', {
      password: 'password', username: 'jdoe', name: 'John Doe'
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

      cy.get('#loginForm').should('not.exist')
      cy.get('#notification').should('contain', 'Login successful')
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

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({username: 'ltamagny', password: 'motdepasse'})
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      
      cy.get('#titleInput').type('new blog title')
      cy.get('#authorInput').type('new blog author')
      cy.get('#urlInput').type('http://newblog.url')
      cy.get('#submitInput').click()

      cy.contains('new blog title').should('exist')
      cy.get('#titleInput').should('not.have.css', 'style', 'none')
    })

    describe('one blog is created', function() {
      beforeEach(function () {
        cy.createBlog({title: 'a new test blog', author: 'author 1', url: 'https://anewtestblog.blog'})
        cy.visit('http://localhost:5173')   
      })

      it('blog can be liked', function() {
        cy.contains('a new test blog author 1').parent().as('blog')
        cy.get('@blog').find('.viewButton').click()
        cy.get('@blog').find('.likeButton').click()
        cy.get('@blog').find('#likes').should('contain', 1)
      })

      it('blog created by the user can be deleted by it', function () {
        cy.createBlog({title: 'to be deleted', author: 'Personne', url: 'http://notnecessary.org'})
        cy.visit('http://localhost:5173')
        cy.contains('to be deleted').parent().as('toBeDeleted')
        cy.get('@toBeDeleted').find('.viewButton').click()
        cy.get('@toBeDeleted').find('.deleteButton').click()
        cy.contains('to be deleted Personne').should('not.exist')
      })

      it('delete button visible only to the creator of the blog', function () {
        cy.login({username: 'jdoe', password: 'password'})
        cy.createBlog({title: 'to be deleted', author: 'Personne', url: 'http://notnecessary.org'})
        cy.reload()
        cy.contains('to be deleted').parent().find('.viewButton').click()
        cy.contains('to be deleted').parent().find('.deleteButton').should('exist')
        cy.contains('a new test blog').parent().find('.viewButton').click()
        cy.contains('a new test blog').parent().find('.deleteButton').should('have.css', 'display', 'none')
      })
    })

    describe('three blogs are created', function() {
      beforeEach(function() {
        cy.createBlog({title: 'a new test blog', author: 'author 1', url: 'https://anewtestblog.blog'})
        cy.createBlog({title: 'another title', author: 'author b', url: 'http://url'})
        cy.createBlog({title: 'Title of a blog', author: 'author 3', url: 'http://url'})
        cy.reload()
      })

      it.only('blogs are sorted by the number of likes', function() {
        cy.get('.blog').eq(2).find('.viewButton').click()
        cy.get('.blog').eq(2).find('.likeButton').click()
        cy.get('.blog').eq(0).should('contain', 'Title of a blog author 3')

        cy.contains('another title author b').parent().find('.viewButton').click()
        cy.contains('another title author b').parent().find('.likeButton').click()
        cy.contains('another title author b').parent().find('.likeButton').click()

        cy.get('.blog').eq(0).should('contain', 'likes 2')
        cy.get('.blog').eq(1).should('contain', 'likes 1')
        cy.get('.blog').eq(2).find('.viewButton').click()
        cy.get('.blog').eq(2).should('contain', 'likes 0')

      })
    })
  })
})