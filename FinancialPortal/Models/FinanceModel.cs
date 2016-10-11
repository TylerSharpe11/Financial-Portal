namespace FinancialPortal.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class FinanceModel : DbContext
    {
        public FinanceModel()
            : base("name=FinanceModel")
        {
        }

        public virtual DbSet<Insight_SchemaRegistry> Insight_SchemaRegistry { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }
        public virtual DbSet<Account> Accounts { get; set; }
        public virtual DbSet<BudgetItem> BudgetItems { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Invitation> Invitations { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<UserClaim> UserClaims { get; set; }
        public virtual DbSet<UserLogin> UserLogins { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Insight_SchemaRegistry>()
                .Property(e => e.SchemaGroup)
                .IsUnicode(false);

            modelBuilder.Entity<Insight_SchemaRegistry>()
                .Property(e => e.ObjectName)
                .IsUnicode(false);

            modelBuilder.Entity<Insight_SchemaRegistry>()
                .Property(e => e.Signature)
                .IsUnicode(false);

            modelBuilder.Entity<Insight_SchemaRegistry>()
                .Property(e => e.Type)
                .IsUnicode(false);

            modelBuilder.Entity<Account>()
                .Property(e => e.Balance)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Account>()
                .Property(e => e.ReconciledBalance)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Role>()
                .HasMany(e => e.Users)
                .WithMany(e => e.Roles)
                .Map(m => m.ToTable("UserRoles", "Security").MapLeftKey("RoleId").MapRightKey("UserId"));

            modelBuilder.Entity<User>()
                .HasMany(e => e.UserClaims)
                .WithRequired(e => e.User)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<User>()
                .HasMany(e => e.UserLogins)
                .WithRequired(e => e.User)
                .WillCascadeOnDelete(false);
        }
    }
}
