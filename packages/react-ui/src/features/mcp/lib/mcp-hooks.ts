import { useQuery, useMutation } from '@tanstack/react-query';

import { authenticationSession } from '@/lib/authentication-session';
import {
  McpWithTools,
  ListMcpsRequest,
  SeekPage,
  assertNotNullOrUndefined,
} from '@activepieces/shared';

import { mcpApi } from './mcp-api';

export const mcpHooks = {
  useMcps: (request: Omit<ListMcpsRequest, 'projectId'>) => {
    const projectId = authenticationSession.getProjectId();
    assertNotNullOrUndefined(projectId, 'projectId is not set');
    return useQuery<SeekPage<McpWithTools>, Error>({
      queryKey: ['mcp-servers', request, projectId],
      queryFn: () =>
        mcpApi.list({
          ...request,
          projectId,
        }),
      staleTime: 0,
    });
  },
  useMcp: (id: string) => {
    return useQuery<McpWithTools, Error>({
      queryKey: ['mcp', id],
      queryFn: () => mcpApi.get(id),
      enabled: !!id,
    });
  },
  useCreateMcp: () => {
    const projectId = authenticationSession.getProjectId();
    assertNotNullOrUndefined(projectId, 'projectId is not set');
    return useMutation({
      mutationFn: async (name: string) => {
        return mcpApi.create({
          name,
          projectId,
        });
      },
    });
  },
  useDeleteMcp: () => {
    return useMutation({
      mutationFn: async (id: string) => {
        await mcpApi.delete(id);
      },
    });
  },
};
