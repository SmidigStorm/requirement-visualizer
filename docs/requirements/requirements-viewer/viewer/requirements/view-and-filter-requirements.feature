@VIW-REQ-001
Feature: View and Filter Requirements
  As a user
  I want to view all requirements and filter them by domain, subdomain, and capability
  So that I can understand the status of requirements across the system

  Background:
    Given the test data is loaded

  Rule: Default view shows all requirements

    Scenario: View all requirements on page load
      When I open the requirements viewer
      Then I should see requirements in a table
      And the table should display columns: ReqID, Title, Domain, Subdomain, Capability, Status, Priority

  Rule: Requirements can be filtered independently

    Scenario: Filter requirements by domain
      When I open the requirements viewer
      And I select domain "TEST-Education"
      Then I should see requirement "TEST-REQ-001"
      And I should see only requirements from domain "TEST-Education"

    Scenario: Filter requirements by subdomain
      When I open the requirements viewer
      And I select subdomain "TEST-Enrollment"
      Then I should see requirement "TEST-REQ-001"
      And I should see only requirements from subdomain "TEST-Enrollment"

    Scenario: Filter requirements by capability
      When I open the requirements viewer
      And I select capability "TEST-Registration"
      Then I should see requirement "TEST-REQ-001"
      And I should see only requirements from capability "TEST-Registration"

    Scenario: Combine multiple filters
      When I open the requirements viewer
      And I select domain "TEST-Education"
      And I select subdomain "TEST-Enrollment"
      Then I should see requirement "TEST-REQ-001"

    Scenario: Clear filters shows all requirements
      Given I am viewing all requirements
      And I select domain "TEST-Education"
      When I clear all filters
      Then I should see requirements in a table
