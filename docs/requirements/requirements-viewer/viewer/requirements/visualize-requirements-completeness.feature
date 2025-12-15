@VIW-REQ-002
Feature: Visualize Requirements Completeness
  As a user
  I want to see a treemap visualization of requirements completeness
  So that I can quickly understand the implementation status across the system

  Background:
    Given the requirements data is loaded from Airtable

  Rule: Treemap displays nested hierarchy

    Scenario: View completeness treemap on page load
      When I open the completeness visualization
      Then I should see a treemap with nested rectangles
      And the hierarchy should be Domain > Subdomain > Capability

    Scenario: Treemap shows completeness metrics
      When I open the completeness visualization
      Then each capability section should display the total requirements count
      And each capability section should display the implemented requirements count
      And each capability section should display the completion percentage

  Rule: Color coding indicates completion status

    Scenario Outline: Completion percentage determines color
      Given a capability has <completion>% completion
      When I view the treemap
      Then that capability section should be colored <color>

      Examples:
        | completion | color  |
        | 0          | red    |
        | 33         | red    |
        | 34         | yellow |
        | 66         | yellow |
        | 67         | green  |
        | 100        | green  |

    Scenario: Empty capability shows gray
      Given a capability has 0 requirements
      When I view the treemap
      Then that capability section should be colored gray
      And it should display "0 / 0 (0%)"

  Rule: Filters control treemap data

    Scenario: Filter treemap by domain
      Given I am viewing the completeness treemap
      When I select a domain filter
      Then the treemap should only show data for that domain

    Scenario: Filter treemap by subdomain
      Given I am viewing the completeness treemap
      When I select a subdomain filter
      Then the treemap should only show data for that subdomain

    Scenario: Filter treemap by capability
      Given I am viewing the completeness treemap
      When I select a capability filter
      Then the treemap should only show data for that capability

    Scenario: Clear filters shows all data
      Given I have filters applied to the treemap
      When I clear all filters
      Then the treemap should show all domains, subdomains, and capabilities

