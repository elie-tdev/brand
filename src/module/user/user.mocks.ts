import * as c from 'casual'

export const UserMocks = {
  User: () => ({
    userID: c.uuid,
    firebaseUID: c.integer(1000, 10000),
    name: c.full_name,
    email: c.email,
    createdAt: c.date('YYYY-MM-DD'),
    updatedAt: c.date('YYYY-MM-DD'),
  }),
}
