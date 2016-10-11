using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using FinancialPortal.DataAccess;
using FinancialPortal.Models;
using System.Linq;
using Microsoft.AspNet.Identity;

namespace FinancialPortal.Infrastructure
{
    public class InsightUserStore :
        IUserPasswordStore<User, int>, 
        IUserLoginStore<User, int>,
        IUserRoleStore<User, int>, 
        IUserClaimStore<User, int>, 
        IUserEmailStore<User, int>,
        IUserLockoutStore<User,int>,
        IUserSecurityStampStore<User,int>,
        IUserTwoFactorStore<User,int>
    {
        private readonly IUserDataAccess _userData;

        public InsightUserStore(IUserDataAccess userData)
        {
            _userData = userData;
        }

        public void Dispose()
        {

        }

        public Task CreateAsync(User user)
        {
            return _userData.InsertUserAsync(user);
        }

        public Task UpdateAsync(User user)
        {
            return _userData.UpdateUserAsync(user);
        }

        public Task DeleteAsync(User user)
        {
            return _userData.DeleteUserAsync(user.Id);
        }

        public async Task<User> FindByIdAsync(int userId)
        {
            var user = await _userData.SelectUserAsync(userId);
            return user;
        }

        public Task<User> FindByNameAsync(string userName)
        {
            return _userData.FindUserByUserNameAsync(userName);
        }





        public Task SetPhoneNumberConfirmedAsync(User user, bool confirmed)
        {
            return Task.FromResult(true);
        }

        public Task SetPasswordHashAsync(User user, string passwordHash)
        {
            return Task.FromResult(user.PasswordHash = passwordHash);
        }

        public Task<string> GetPasswordHashAsync(User user)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(User user)
        {
            return Task.FromResult(user.PasswordHash == null);
        }

        public Task AddLoginAsync(User user, UserLoginInfo login)
        {
            return _userData.InsertUserLoginAsync(new UserLogin()
            {
                LoginProvider = login.LoginProvider,
                ProviderKey = login.ProviderKey,
                UserId = user.Id
            });
        }

        public Task RemoveLoginAsync(User user, UserLoginInfo login)
        {
            return _userData.DeleteUserLoginAsync(new UserLogin()
            {
                LoginProvider = login.LoginProvider,
                ProviderKey = login.ProviderKey,
                UserId = user.Id
            });
        }

        public async Task<IList<UserLoginInfo>> GetLoginsAsync(User user)
        {
            var logins = await _userData.GetLoginsForUserAsync(user.Id);

            return logins
                .Select(x => new UserLoginInfo(x.LoginProvider, x.ProviderKey))
                .ToList();
        }

        public Task<User> FindAsync(UserLoginInfo login)
        {
            return _userData.FindUserByLoginAsync(login.LoginProvider, login.ProviderKey);
        }

        public Task AddToRoleAsync(User user, string roleName)
        {
            return _userData.AddUserToRoleAsync(user.Id, roleName);
        }

        public Task RemoveFromRoleAsync(User user, string roleName)
        {
            return _userData.RemoveUserFromRoleAsync(user.Id, roleName);
        }

        public Task<IList<string>> GetRolesAsync(User user)
        {
            return _userData.GetRolesForUserAsync(user.Id);
        }

        public Task<bool> IsInRoleAsync(User user, string roleName)
        {
            return _userData.IsUserInRoleAsync(user.Id, roleName);
        }

        public async Task<IList<Claim>> GetClaimsAsync(User user)
        {
            var userClaims = await _userData.GetUserClaimsAsync(user.Id);

            var claims = userClaims
                .Select(x => new Claim(x.ClaimType, x.ClaimValue))
                .ToList();

            // add other app specific claims
            if (user.Name != null)
                claims.Add(new Claim(ClaimTypes.GivenName, user.Name));

            return claims;
        }

        public async Task AddClaimAsync(User user, Claim claim)
        {
            //?? why await? Why not userId?
            await _userData.InsertUserClaimAsync(new UserClaim()
            {
                UserId = user.Id,
                ClaimType = claim.Type,
                ClaimValue = claim.Value
            });
        }

        public async Task RemoveClaimAsync(User user, Claim claim)
        {
            await _userData.RemoveUserClaimAsync(user.Id, claim.Type);
        }

        public Task SetEmailAsync(User user, string email)
        {
            return Task.FromResult(user.Email = email);
        }

        public Task<string> GetEmailAsync(User user)
        {
            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(User user)
        {
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task SetEmailConfirmedAsync(User user, bool confirmed)
        {
            return Task.FromResult(user.EmailConfirmed = confirmed);
        }

        public Task<User> FindByEmailAsync(string email)
        {
            return _userData.FindUserByEmailAsync(email);
        }

        public Task<DateTimeOffset> GetLockoutEndDateAsync(User user)
        {
            DateTimeOffset myDate=new DateTime(2018, 6, 19, 7, 0, 0);;

            if (user.LockoutEndDate.HasValue)
                myDate = (DateTimeOffset)user.LockoutEndDate;

            return Task.FromResult(myDate);
        }

        public Task SetLockoutEndDateAsync(User user, DateTimeOffset lockoutEnd)
        {
            return Task.FromResult(true);
        }

        public Task<int> IncrementAccessFailedCountAsync(User user)
        {
            user.AccessFailedCount++;
            return Task.FromResult(user.AccessFailedCount);
        }

        public Task ResetAccessFailedCountAsync(User user)
        {
            return Task.FromResult(user.AccessFailedCount = 0);
        }

        public Task<int> GetAccessFailedCountAsync(User user)
        {
            return Task.FromResult(user.AccessFailedCount);
        }

        public Task<bool> GetLockoutEnabledAsync(User user)
        {
            return Task.FromResult(user.LockoutEnabled);
        }

        public Task SetLockoutEnabledAsync(User user, bool enabled)
        {
            return Task.FromResult(user.LockoutEnabled = enabled);
        }

        public Task SetSecurityStampAsync(User user, string stamp)
        {
            return Task.FromResult(user.SecurityStamp = stamp);
        }

        public Task<string> GetSecurityStampAsync(User user)
        {
            return Task.FromResult(user.SecurityStamp);
        }

        public Task SetTwoFactorEnabledAsync(User user, bool enabled)
        {
            return Task.FromResult(false);
        }

        public Task<bool> GetTwoFactorEnabledAsync(User user)
        {
            return Task.FromResult(false);
        }

        
    }
}