'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');

const baseUrl = 'http://localhost:8080';

const Issues = {};

Issues.get = async (context) => {
  const issue = await Issue.findByPk(context.params.id);
  respond.success(context, { issue });
};

Issues.create = async (context) => {
  try {
    const { title, description } = context.request.body;

    if (!title || !description) {
      context.status = 400;
      context.body = { error: 'Title and description are required.' };
      return;
    }

    const newIssue = await Issue.create({ title, description });

    context.status = 201;
    context.set('Location', `/issues/${newIssue.id}`);
    context.body = newIssue;
  } catch (error) {
    console.error('Error creating issue:', error);
    context.status = 500;
    context.body = { error: 'Failed to create issue.' };
  }
};

//update the issue / shall we move this to the create method ?? risk ??
Issues.update = async (context) => {
  try {
    const issueId = context.params.id;
    const updates = context.request.body;

    // Find the issue by id
    const issue = await Issue.findByPk(issueId);

    if (!issue) {
      respond.notFound(context); // can we return 404 ? ideal
      return;
    }

    // Update the issue with new data
    await issue.update(updates);

    const updatedIssue = await Issue.findByPk(issueId);

    respond.success(context, { issue: updatedIssue });
  } catch (error) {
    console.error('Error updating issue:', error);
    context.status = 500; // Internal Server Error ??
    context.body = { error: 'Failed to update issue.' };
  }
};


module.exports = Issues;
