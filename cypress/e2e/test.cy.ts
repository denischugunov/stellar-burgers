describe('E2E тест конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env('BURGER_API_URL')}/ingredients`, {
      statusCode: 200,
      fixture: 'ingredients'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Проверка отображения ингредиентов', () => {
    cy.get('[data-test-ingredient-type="bun"]').should(
      'have.length.at.least',
      1
    );
    cy.get('[data-test-ingredient-type="main"]').should(
      'have.length.at.least',
      1
    );
    cy.get('[data-test-ingredient-type="sauce"]').should(
      'have.length.at.least',
      1
    );
  });

  it('Проверка добавления ингредиента из списка в конструктор', () => {
    cy.get(
      '[data-test-ingredient-type="bun"][data-test-ingredient-name="Краторная булка N-200i"]'
    )
      .find('button[type="button"]')
      .click();

    cy.get('.constructor-element_pos_top').should(
      'contain.text',
      'Краторная булка N-200i'
    );
  });

  describe('Проверка модального окна', () => {
    beforeEach(() => {
      cy.get(
        '[data-test-ingredient-type="bun"][data-test-ingredient-name="Краторная булка N-200i"]'
      ).click();

      cy.get('[data-test="modal"]').should('exist');
    });

    it('Проверка, что модальное окно закрывается по "крестику"', () => {
      cy.get('#modals button[type="button"]').click();
      cy.get('[data-test="modal"]').should('not.exist');
    });

    it('Проверка, что модальное окно закрывается по клику на оверлей', () => {
      cy.get('[data-test="overlay"]').click({ force: true });
      cy.get('[data-test="modal"]').should('not.exist');
    });
  });
});

describe('Проверка оформления заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
    localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

    cy.intercept('GET', `${Cypress.env('BURGER_API_URL')}/auth/user`, {
      fixture: 'user'
    }).as('getUser');

    cy.intercept('POST', `${Cypress.env('BURGER_API_URL')}/orders`, {
      fixture: 'order'
    }).as('postOrder');

    cy.intercept('GET', `${Cypress.env('BURGER_API_URL')}/ingredients`, {
      statusCode: 200,
      fixture: 'ingredients'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('Успешное оформление заказа', () => {
    // Добавляем булку
    cy.get(
      '[data-test-ingredient-type="bun"][data-test-ingredient-name="Краторная булка N-200i"]'
    )
      .find('button[type="button"]')
      .click();

    // Добавляем "основу"
    cy.get(
      '[data-test-ingredient-type="main"][data-test-ingredient-name="Биокотлета из марсианской Магнолии"]'
    )
      .find('button[type="button"]')
      .click();

    cy.get('.constructor-element_pos_top').should(
      'contain.text',
      'Краторная булка N-200i'
    );
    cy.get('.constructor-element_pos_bottom').should(
      'contain.text',
      'Краторная булка N-200i'
    );
    cy.get('.constructor-element').should(
      'contain.text',
      'Биокотлета из марсианской Магнолии'
    );

    cy.get('[data-test="make-order"]').click();

    cy.wait('@postOrder').then((interception) => {
      expect(interception.response!.statusCode).to.eq(200);
      expect(interception.response!.body.order.number).to.exist;

      const orderNumber = interception.response!.body.order.number;
      cy.get('[data-test="modal"]').should('contain.text', orderNumber);

      cy.get('[data-test="overlay"]').click({ force: true });
      cy.contains('div', 'Выберите начинку');
    });
  });
});
