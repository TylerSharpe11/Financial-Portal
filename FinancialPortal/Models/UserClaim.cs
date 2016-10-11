namespace FinancialPortal.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Security.UserClaims")]
    public partial class UserClaim
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        public string ClaimType { get; set; }

        [Required]
        public string ClaimValue { get; set; }

        public virtual User User { get; set; }
    }
}
