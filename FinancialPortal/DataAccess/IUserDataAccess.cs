using System.Collections.Generic;
using System.Threading.Tasks;
using FinancialPortal.Models;
using Insight.Database;
using System;

namespace FinancialPortal.DataAccess
{
    [Sql(Schema = "Security")]
    public interface IUserDataAccess
    {
        Task<User> FindUserByUserNameAsync(string userName);
        Task<bool> IsUserInRoleAsync(int userId, string role);
        Task<IList<string>> GetRolesForUserAsync(int userId);
        Task RemoveUserFromRoleAsync(int userId, string role);
        Task<IList<UserLogin>> GetLoginsForUserAsync(int userId);
        Task<User> FindUserByLoginAsync(string loginProvider, string providerKey);
        Task<IList<UserClaim>> GetUserClaimsAsync(int userId);
        Task<User> FindUserByEmailAsync(string email);
        User FindUserByEmail(string email);

        Task RemoveUserClaimAsync(int userId, string claimType);
        Task<bool> AddUserToRoleAsync(int userId, string role);
        IList<User> GetUsersByHousehold(Guid household);


        // auto procs
        Task<User> SelectUserAsync(int id);
        User SelectUser(int id);
        Task DeleteUserAsync(int id);
        Task UpdateUserAsync(User user);
        void UpdateUser(User user);
        Task InsertUserAsync(User user);
        Task InsertUserLoginAsync(UserLogin userLogin);
        Task DeleteUserLoginAsync(UserLogin login);
        Task InsertUserClaimAsync(UserClaim claim);

    }
}