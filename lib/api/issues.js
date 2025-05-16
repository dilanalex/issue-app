'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');
const IssueRevision = require('../models/issueRevision');
const User = require('../models/user');

const baseUrl = 'http://localhost:8080';

const Issues = {};

async function get(ctx) {
  const issue = await Issue.findByPk(ctx.params.id);
  respond.success(ctx, { issue });
};

async function create(ctx) {
  //const transaction = await sequelize.transaction();
  try {
    const { title, description } = ctx.request.body;
    const createdBy = ctx.state.user ? ctx.state.user.username : 'unknown'; // Get username from context

    console.log("ctx.state.user", ctx.state.user);
    const issue = await Issue.create(
      { title, 
        description, 
        userId: ctx.state.user.id,
        created_by: createdBy,
      });

    
    //get the plain object so values are not wrapped in sequelize object
    const createdIssue = issue.get({ plain: true })

    // Store the initial revision
    await IssueRevision.create({
      issueId: createdIssue.id,
      userId: ctx.state.user.id,
      currentState: createdIssue, // Get the raw object
      changes: null, // Initially, all fields are 'changed' from null
      updatedAt: createdIssue.created_at,
    });

    ctx.status = 201;
    ctx.body = issue;
  } catch (error) {
    console.error('Error creating issue:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to create issue.' };
  }
}

//update the issue / shall we move this to the create method ?? risk ??
async function update(ctx) {
  const issueId = ctx.params.id;
  const userId = ctx.state.user.id;
  console.log("ctx.state.user", ctx.state.user);
  const updatedBy = ctx.state.user ? ctx.state.user.username : 'unknown';
  const updates = { ...ctx.request.body, updated_by: updatedBy };

  try {
    const issue = await Issue.findByPk(issueId);
    if (!issue) {
      ctx.status = 404;
      ctx.body = { error: 'Issue not found.' };
      return;
    }

    const previousState = JSON.parse(JSON.stringify(issue.get({ plain: true })));//cloning to avoid reference issues
    //previousState would be updated with the new values if we do not clone it
    //console.log('Previous State Before Update:', previousState);
  
    console.log('Updates:', updates);
    await issue.update(updates);

    // Refresh the issue from the database to get the latest state
    const updatedIssue = await Issue.findByPk(issueId);
    const currentState = updatedIssue.get({ plain: true });

    //console.log('Previous State After Update:', previousState);
    //console.log('Current State:', currentState);

    const changes = {};
    for (const key in currentState) {
      if (
        currentState.hasOwnProperty(key) && previousState[key] !== currentState[key] &&
        key !== 'created_at' && // Exclude metadata fields
        key !== 'updated_at'
      ) {
        changes[key] = currentState[key];
      }
    }

    //console.log('Detected Changes:', changes);

    if (Object.keys(changes).length > 0) {
      await IssueRevision.create({
        issueId: issue.id,
        userId: userId,
        currentState: currentState,
        changes: changes,
        updatedAt: new Date(),
      });
    }

    ctx.status = 200;
    ctx.body = updatedIssue;
  } catch (error) {
    console.error('Error updating issue:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to update issue.' };
  }
}

async function getRevisions(ctx) {
  const issueId = ctx.params.issueId;

  try {
    const revisions = await IssueRevision.findAll({
      where: { issueId: issueId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username'], // Include basic user info
      }],
      order: [['updatedAt', 'DESC']], // Show latest revisions first
    });

    ctx.status = 200;
    ctx.body = revisions;
  } catch (error) {
    console.error('Error fetching issue revisions:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch issue revisions.' };
  }
}



module.exports = { getRevisions, get, create, update };
