namespace FinancialPortal.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Security.Invitations")]
    public partial class Invitation
    {
        public int Id { get; set; }

        public int FromUserId { get; set; }

        public string ToEmail { get; set; }
        public string FromEmail { get; set; }

        public string SecurityHash { get; set; }
        public Boolean? Accepted { get; set; }
        public Guid Household { get; set; }

    }
}
