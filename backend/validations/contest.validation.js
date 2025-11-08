// import z from 'zod'

// export const contestSchema = z.object({
//   level:z.enum(["Beginner", "Intermediate", "Expert"]),
//   round:z.number().int().positive(),
//   setter:z.string(),
//   problems:z.array(z.string()),
//   contestDate: z.date(),
//   duration:z.number().positive(),
//   published:z.boolean().optional().default(false)
// })
import z from 'zod';

export const contestSchema = z.object({
  level: z.enum(["Beginner", "Intermediate", "Expert"]),
  contestDate: z.string().optional().transform(str => str?  new Date(str) : null),
  duration: z.number().positive(),
  problems: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      statement: z.string(),
      samples: z.number().optional(),
      checker: z.string().optional(),
      testCases: z.array(
        z.object({
          input: z.string(),
          output: z.string()
        })
      )
    })
  ),
  published: z.boolean().optional().default(false)
});
