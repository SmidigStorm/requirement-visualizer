@VIW-REQ-001
Feature: View and Filter Requirements
  As a user
  I want to view all requirements and filter them by domain, subdomain, and capability
  So that I can understand the status of requirements across the system

  Background:
    Given the requirements data is loaded from Airtable

  Rule: Default view shows all requirements

    Scenario: View all requirements on page load
      When I open the requirements viewer
      Then I should see all requirements in a table
      And the table should display columns: ReqID, Title, Domain, Subdomain, Capability, Status, Priority

  Rule: Requirements can be filtered independently

    Scenario: Filter requirements by domain
      Given I am viewing all requirements
      When I select a domain filter
      Then I should see only requirements belonging to that domain

    Scenario: Filter requirements by subdomain
      Given I am viewing all requirements
      When I select a subdomain filter
      Then I should see only requirements belonging to that subdomain

    Scenario: Filter requirements by capability
      Given I am viewing all requirements
      When I select a capability filter
      Then I should see only requirements belonging to that capability

    Scenario: Combine multiple filters
      Given I am viewing all requirements
      When I select a domain filter
      And I select a subdomain filter
      Then I should see only requirements matching both filters

    Scenario: Clear filters
      Given I have filters applied
      When I clear all filters
      Then I should see all requirements

  Rule: Empty results are handled gracefully

    Scenario: No requirements match filters
      Given I am viewing all requirements
      When I apply filters that match no requirements
      Then I should see a message "No requirements found"
