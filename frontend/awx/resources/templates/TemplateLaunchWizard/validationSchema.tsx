export const launchValidationSchema = {
  type: 'object',
  properties: {
    'inventory-step': {
      type: 'object',
      properties: {
        inventory: {
          type: 'object',
          errorMessage: 'inventory field is required',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
          },
          required: ['id'],
        },
      },
      required: ['inventory'],
    },
    'credentials-step': {
      type: 'object',
      properties: {
        credentials: {
          type: 'array',
        },
      },
    },
    'execution-environment-step': {
      type: 'object',
      properties: {
        execution_environment: {
          type: 'object',
        },
      },
    },
    'instance-groups-step': {
      type: 'object',
      properties: {
        instance_groups: {
          type: 'array',
        },
      },
      required: ['instance_groups'],
      additionalProperties: false,
    },
    'other-prompts-step': {
      type: 'object',
      properties: {
        job_type: {
          type: 'string',
          enum: ['run', 'check'],
        },
        labels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
            },
          },
        },
        forks: {
          anyOf: [
            {
              type: 'string',
              pattern: '^[0-9]+$',
            },
            {
              type: 'number',
              minimum: 0,
              multipleOf: 1,
            },
          ],
          errorMessage: 'The value must be a number greater than or equal to 0.',
        },
        limit: {
          type: 'string',
        },
        verbosity: {
          type: 'number',
        },
        job_slice_count: {
          anyOf: [
            {
              type: 'string',
              pattern: '^[0-9]+$',
            },
            {
              type: 'number',
              minimum: 0,
              multipleOf: 1,
            },
          ],
          errorMessage: 'The value must be a number greater than or equal to 0.',
        },
        timeout: {
          anyOf: [{ type: 'string' }, { type: 'number' }],
        },
        diff_mode: {
          type: 'boolean',
        },
        scm_branch: {
          type: 'string',
        },
        extra_vars: {
          type: 'string',
        },
        job_tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              value: { type: 'string' },
            },
          },
        },
        skip_tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              value: { type: 'string' },
            },
          },
        },
      },
    },
  },
};
