describe('Appointments page', () => {
  before(() => {
    cy.visit('/appointments');
  });

  it('can see the appointment form', () => {
    cy.pick('appointmentForm').should('be.visible');
  });
  it('can see the appointment list', () => {
    cy.pick('appointmentList').should('be.visible');
  });
  it('should get availabilities and populate its table when selecting practitioner', () => {
    cy.intercept('GET', '**availabilities?practitionerId=59').as(
      'getAvailabilities',
    );
    cy.get('input[name = practitionerId]').first().click();

    cy.wait('@getAvailabilities').then((interceptor) => {
      const { statusCode, body } = interceptor.response;
      cy.wrap(statusCode).should('be.oneOf', [304, 200]);
      if (statusCode === 200)
        cy.get('input[name = availabilityId]')
          .its('length')
          .should('eq', body.length);
    });
  });
  it('shouldnt display error when submitting the form without choosing patient', () => {
    cy.pick('appointmentForm').submit();
    cy.pick('patientId-err').contains('Required');
  });
  it('shouldnt display error when submitting the form without chossing availability', () => {
    cy.pick('appointmentForm').submit();
    cy.pick('availabilityId-err').contains('Required');
  });

  it('should send a request after submitting the form with all required values', () => {
    cy.get('input[name = practitionerId]').first().click();
    cy.get('input[name = patientId]').first().click();
    cy.get('input[name = availabilityId]').first().click();
    cy.intercept('POST', '**/appointments').as('addAppointment');
    cy.pick('appointmentForm').submit();
    cy.wait('@addAppointment').its('response.statusCode').should('eq', 200);
  });
});
