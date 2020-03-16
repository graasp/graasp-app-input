import { TEACHER_MODE } from '../../src/config/settings';
import {
  settingsButton,
  settingsModal,
  headerVisibility,
} from '../constants/selectors';

describe('<Settings />', () => {
  beforeEach(() => {
    cy.onlineVisit(TEACHER_MODE);
  });

  it('open settings, headerVisible option hide/show header for students', () => {
    // open settings
    cy.get(settingsButton).click();

    cy.wait(2000);

    cy.get(settingsModal).should('be.visible');
    cy.get(headerVisibility)
      .should('be.visible')
      .then($headerVisible => {
        // click if is unchecked
        if ($headerVisible.attr('checked') === 'checked') {
          cy.get(headerVisibility).click();
        }
      });

    // click outside to exit
    cy.get('body').click('right');
    cy.get(settingsModal).should('not.be.visible');

    // click outside to exit
    cy.get('body').click('right');

    cy.onlineVisit();
    cy.wait(2000);

    // header is disabled
    cy.get('header').should('not.exist');

    // reset status
    cy.onlineVisit(TEACHER_MODE);
    cy.get(settingsButton).click();
    cy.get(headerVisibility).click();
    cy.get('body').click('right');
    cy.onlineVisit();
    cy.wait(2000);

    // header is disabled
    cy.get('header').should('be.visible');
  });
});
