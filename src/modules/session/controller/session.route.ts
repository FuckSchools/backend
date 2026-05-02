import express from 'express';
import {
  createSession,
  getSessionsByProject,
} from '../application/session.js';
import { createThread, createMessage, getMessagesByThread } from '../application/thread.js';
import type { ISessionRepository } from '../domain/interface/session.interface.js';

export const sessionController = (repository: ISessionRepository) => {
  const router: express.Router = express.Router();

  router.post('/projects/:projectId/sessions', async (req, res) => {
    try {
      const projectId = req.params['projectId'] as string;
      const session = await createSession(repository)(
        projectId,
        req.body['owner'],
      );
      res.status(201).json(session);
    } catch (error) {
      console.error('createSession error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/projects/:projectId/sessions', async (req, res) => {
    try {
      const projectId = req.params['projectId'] as string;
      const sessions = await getSessionsByProject(repository)(projectId);
      res.status(200).json(sessions);
    } catch (error) {
      console.error('getSessionsByProject error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/sessions/:sessionId/threads', async (req, res) => {
    try {
      const sessionId = req.params['sessionId'] as string;
      const thread = await createThread(repository)(
        sessionId,
        req.body['goals'],
      );
      res.status(201).json(thread);
    } catch (error) {
      console.error('createThread error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/threads/:threadId/messages', async (req, res) => {
    try {
      const threadId = req.params['threadId'] as string;
      const message = await createMessage(repository)(
        threadId,
        req.body['role'],
        req.body['content'],
      );
      res.status(201).json(message);
    } catch (error) {
      console.error('createMessage error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/threads/:threadId/messages', async (req, res) => {
    try {
      const threadId = req.params['threadId'] as string;
      const messages = await getMessagesByThread(repository)(threadId);
      res.status(200).json(messages);
    } catch (error) {
      console.error('getMessagesByThread error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};
