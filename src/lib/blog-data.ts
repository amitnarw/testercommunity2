export interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  readTime: string;
  views: string;
  publishedAt: string;
  content: string;
  author: {
    name: string;
    role: string;
  };
}

export const articles: Article[] = [
  // Getting Started Articles
  {
    id: "1",
    title: "How to get started with testing",
    description:
      "A comprehensive guide to begin your testing journey on our platform",
    category: "Getting Started",
    slug: "how-to-get-started-with-testing",
    readTime: "5 min read",
    views: "2.3k",
    publishedAt: "2024-01-15",
    author: {
      name: "Sarah Johnson",
      role: "Product Manager",
    },
    content: `
# How to Get Started with Testing

Welcome to inTesters! This guide will walk you through everything you need to know to start testing apps on our platform.

## Step 1: Create Your Account

First, sign up for a free account on our platform. You'll need to verify your email address to get started.

## Step 2: Complete Your Profile

Fill out your profile with accurate information. This helps app developers understand your testing background and device capabilities.

## Step 3: Choose Your Path

We offer two testing paths:

### Community Path (Free)
- Test other developers' apps to earn points
- Use earned points to get your own app tested
- Great for developers on a budget

### Professional Path (Paid)
- Purchase points directly
- Get guaranteed, high-quality testing from vetted professionals
- Faster turnaround times

## Step 4: Start Testing

Browse available testing opportunities in the Community Hub. Each test will show:
- Points you'll earn
- Estimated time required
- Device requirements
- Testing instructions

## Tips for Success

1. **Read instructions carefully** - Make sure you understand what the developer needs
2. **Test thoroughly** - Don't rush through tests
3. **Provide detailed feedback** - The more specific, the better
4. **Be honest** - Report bugs and issues you find

## Next Steps

Once you're comfortable with the basics, explore our advanced features like automated testing, team collaboration, and priority support.

Happy testing!
    `,
  },
  {
    id: "2",
    title: "Setting up your testing environment",
    description:
      "Learn how to configure your devices and tools for optimal testing",
    category: "Getting Started",
    slug: "setting-up-testing-environment",
    readTime: "7 min read",
    views: "1.9k",
    publishedAt: "2024-01-20",
    author: {
      name: "Mike Chen",
      role: "Technical Lead",
    },
    content: `
# Setting Up Your Testing Environment

A proper testing environment is crucial for providing quality feedback. Here's how to set it up.

## Device Preparation

### Android Devices
1. Enable Developer Options
2. Turn on USB Debugging
3. Install ADB tools on your computer
4. Keep your device updated to the latest OS version

### iOS Devices
1. Register your device with Apple Developer Program
2. Install TestFlight
3. Enable crash reporting
4. Keep iOS updated

## Essential Tools

### Screen Recording
- Use built-in screen recording features
- Recommended: OBS Studio for desktop
- Mobile: Built-in screen recorder

### Bug Reporting
- Screenshot tools with annotation
- Video capture for reproducing bugs
- Network monitoring tools

## Network Setup

Test apps under different network conditions:
- WiFi (fast connection)
- 4G/5G
- Slow 3G (to test performance)
- Offline mode

## Best Practices

1. **Clean device state** - Start with a fresh install
2. **Document everything** - Take screenshots and videos
3. **Test edge cases** - Try unusual inputs and scenarios
4. **Check permissions** - Verify app permission requests

Ready to start testing? Head to the Community Hub!
    `,
  },
  {
    id: "3",
    title: "Understanding test requirements",
    description: "What developers look for in quality test reports",
    category: "Getting Started",
    slug: "understanding-test-requirements",
    readTime: "4 min read",
    views: "1.6k",
    publishedAt: "2024-01-25",
    author: {
      name: "Emily Rodriguez",
      role: "QA Specialist",
    },
    content: `
# Understanding Test Requirements

Learn what makes a great test report and how to meet developer expectations.

## What Developers Need

When you test an app, developers are looking for:

### Functional Testing
- Does the app work as intended?
- Are all features accessible?
- Do buttons and links work?

### Usability Testing
- Is the app easy to navigate?
- Is the UI intuitive?
- Are there any confusing elements?

### Performance Testing
- Does the app load quickly?
- Are there any crashes or freezes?
- How's the battery consumption?

## Writing Quality Reports

### Good Report Example
"The login button on the main screen doesn't respond when tapped. Tested on Samsung Galaxy S21, Android 13. Happens 100% of the time. Video attached."

### Poor Report Example
"App doesn't work."

## Key Elements of a Great Report

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Device and OS information**
5. **Screenshots or videos** as proof

## Common Mistakes to Avoid

- Being too vague
- Not providing reproduction steps
- Skipping screenshots
- Testing too quickly
- Not following test instructions

Master these basics and you'll become a top-rated tester!
    `,
  },

  // Account & Security Articles
  {
    id: "4",
    title: "Setting up two-factor authentication",
    description: "Secure your account with 2FA for enhanced protection",
    category: "Account & Security",
    slug: "setting-up-two-factor-authentication",
    readTime: "4 min read",
    views: "1.5k",
    publishedAt: "2024-01-18",
    author: {
      name: "David Park",
      role: "Security Engineer",
    },
    content: `
# Setting Up Two-Factor Authentication

Protect your account with an extra layer of security using 2FA.

## Why Enable 2FA?

Two-factor authentication adds a second verification step when logging in, making your account much more secure even if someone gets your password.

## How to Enable 2FA

1. Go to **Settings** > **Security**
2. Click **Enable Two-Factor Authentication**
3. Choose your preferred method:
   - Authenticator app (recommended)
   - SMS text message
   - Email code

## Using an Authenticator App

### Recommended Apps
- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password

### Setup Steps
1. Download an authenticator app
2. Scan the QR code shown on screen
3. Enter the 6-digit code from the app
4. Save your backup codes in a safe place

## Backup Codes

When you enable 2FA, you'll receive backup codes. **Save these securely!**

- Each code can only be used once
- Use them if you lose access to your 2FA device
- Store them in a password manager or safe location

## What If I Lose My Device?

If you lose access to your 2FA device:
1. Use a backup code to log in
2. Disable 2FA temporarily
3. Set up 2FA again with a new device

## Best Practices

- Use an authenticator app instead of SMS when possible
- Keep backup codes in a secure location
- Don't share your 2FA codes with anyone
- Update your 2FA method if you change devices

Your account security is our priority!
    `,
  },
  {
    id: "5",
    title: "Managing your account settings",
    description: "Customize your profile and preferences",
    category: "Account & Security",
    slug: "managing-account-settings",
    readTime: "5 min read",
    views: "1.2k",
    publishedAt: "2024-01-22",
    author: {
      name: "Lisa Wang",
      role: "Product Designer",
    },
    content: `
# Managing Your Account Settings

Customize your inTesters experience by configuring your account settings.

## Profile Settings

### Basic Information
- **Name**: Your display name visible to other users
- **Email**: Primary contact email (must be verified)
- **Avatar**: Upload a profile picture
- **Bio**: Tell others about your testing experience

### Testing Preferences
- Preferred device types
- Testing categories of interest
- Availability schedule
- Language preferences

## Notification Settings

Control what emails and notifications you receive:

### Email Notifications
- New testing opportunities
- Points earned/spent
- Messages from developers
- Weekly summary reports

### In-App Notifications
- Real-time test assignments
- Payment confirmations
- System updates
- Community mentions

## Privacy Settings

### Profile Visibility
- Public: Visible to all users
- Private: Only visible to developers you work with
- Anonymous: Hide your identity in public forums

### Data Sharing
- Allow analytics tracking
- Share device information with developers
- Participate in platform surveys

## Payment Settings

### Wallet Configuration
- Add payment methods
- Set up automatic top-ups
- Configure payout preferences
- View transaction history

## Danger Zone

### Account Actions
- Change password
- Download your data
- Deactivate account
- Delete account permanently

**Note**: Account deletion is permanent and cannot be undone.

## Tips for Account Security

1. Use a strong, unique password
2. Enable two-factor authentication
3. Review login activity regularly
4. Keep your email updated
5. Don't share account credentials

Need help? Contact our support team anytime!
    `,
  },

  // Community Hub Articles
  {
    id: "6",
    title: "Community vs Professional testing paths",
    description: "Understand the differences and choose the right path for you",
    category: "Community Hub",
    slug: "community-vs-professional-testing",
    readTime: "6 min read",
    views: "3.1k",
    publishedAt: "2024-01-10",
    author: {
      name: "Alex Thompson",
      role: "Community Manager",
    },
    content: `
# Community vs Professional Testing Paths

Choosing between our Community and Professional paths? Here's everything you need to know.

## Community Path

### How It Works
The Community Path is a **reciprocal testing model**:
1. Test other developers' apps to earn points
2. Use your earned points to get your own app tested
3. Build reputation in the community

### Pros
✅ Completely free
✅ Build testing skills
✅ Network with other developers
✅ Flexible schedule
✅ Learn from diverse apps

### Cons
❌ Requires time investment
❌ Variable turnaround times
❌ Quality depends on tester experience
❌ Need to earn points before getting tests

### Best For
- Indie developers on a budget
- Those with time to contribute
- Developers wanting to learn
- Building long-term presence

## Professional Path

### How It Works
The Professional Path offers **paid testing services**:
1. Purchase points directly
2. Submit your app for testing
3. Get results from vetted professionals
4. Receive detailed reports

### Pros
✅ Fast turnaround (24-48 hours)
✅ Guaranteed quality
✅ Professional testers
✅ Detailed reports
✅ Priority support

### Cons
❌ Costs money
❌ Less community interaction
❌ More formal process

### Best For
- Developers with deadlines
- Commercial apps
- Those needing guaranteed results
- Teams requiring professional QA

## Pricing Comparison

### Community Path
- **Cost**: Free (time investment)
- **Turnaround**: 3-5 days
- **Quality**: Variable
- **Support**: Community forums

### Professional Path
- **Cost**: Starting at $49
- **Turnaround**: 24-48 hours
- **Quality**: Guaranteed
- **Support**: Priority support

## Can I Use Both?

Yes! Many developers use a hybrid approach:
- Use Community Path for early testing
- Switch to Professional Path before launch
- Use Community for ongoing updates

## Making Your Choice

Consider these factors:
1. **Budget**: How much can you invest?
2. **Timeline**: When do you need results?
3. **App complexity**: How thorough must testing be?
4. **Your availability**: Can you test other apps?

Still unsure? Start with the Community Path and upgrade when needed!
    `,
  },
  {
    id: "7",
    title: "How to earn points in the community",
    description: "Maximize your point earnings through quality testing",
    category: "Community Hub",
    slug: "how-to-earn-points",
    readTime: "5 min read",
    views: "2.7k",
    publishedAt: "2024-01-12",
    author: {
      name: "Jordan Lee",
      role: "Community Lead",
    },
    content: `
# How to Earn Points in the Community

Learn the best strategies to earn points quickly and efficiently.

## Point System Basics

### How Points Work
- Test apps to earn points
- Spend points to get your app tested
- 1 point = 1 test credit
- Points never expire

### Point Values
Different tests offer different point rewards:
- **Quick tests** (15 min): 5-10 points
- **Standard tests** (30 min): 15-25 points
- **Comprehensive tests** (1 hour): 30-50 points
- **Complex tests** (2+ hours): 50-100 points

## Earning Strategies

### 1. Start with Quick Wins
Begin with shorter tests to:
- Build your reputation
- Learn the platform
- Earn initial points quickly

### 2. Provide Quality Reports
High-quality reports earn bonuses:
- **Good report**: Base points
- **Great report**: +20% bonus
- **Exceptional report**: +50% bonus

### 3. Maintain High Ratings
Testers with 4.5+ star ratings get:
- Priority access to high-value tests
- Bonus point multipliers
- Exclusive testing opportunities

### 4. Complete Tests Quickly
Fast, quality completion earns:
- Time bonus points
- Developer appreciation
- More test invitations

### 5. Specialize
Focus on specific categories:
- Gaming apps
- Productivity tools
- E-commerce apps
- Social media apps

Specialists often earn more per test.

## Bonus Opportunities

### Weekly Challenges
- Complete 5 tests: +25 bonus points
- Test 3 different categories: +15 points
- Maintain 5-star rating: +50 points

### Referral Program
- Invite friends: 100 points per signup
- When they complete first test: +50 points
- Ongoing: 5% of their earnings

### Community Contributions
- Write helpful forum posts: 10-20 points
- Create testing guides: 50-100 points
- Report platform bugs: 25-75 points

## Point Multipliers

Earn multiplier badges:
- **Bronze** (100 tests): 1.1x points
- **Silver** (500 tests): 1.25x points
- **Gold** (1000 tests): 1.5x points
- **Platinum** (2500 tests): 2x points

## Tips for Maximum Earnings

1. **Test daily** - Consistency pays off
2. **Be thorough** - Quality over quantity
3. **Respond quickly** - Grab high-value tests fast
4. **Build relationships** - Developers request repeat testers
5. **Stay updated** - New features = new opportunities

Start earning today and build your testing empire!
    `,
  },

  // Billing & Plans Articles
  {
    id: "8",
    title: "Understanding the points system",
    description: "Learn how points work and how to manage them effectively",
    category: "Billing & Plans",
    slug: "understanding-points-system",
    readTime: "3 min read",
    views: "1.8k",
    publishedAt: "2024-01-14",
    author: {
      name: "Rachel Green",
      role: "Finance Manager",
    },
    content: `
# Understanding the Points System

Points are the currency of inTesters. Here's everything you need to know.

## What Are Points?

Points are credits you use to:
- Get your app tested
- Access premium features
- Unlock priority support
- Purchase additional services

## Getting Points

### Earn Points (Free)
Test other developers' apps in the Community Hub:
- Each test completed = points earned
- Point value varies by test complexity
- Bonus points for quality work

### Buy Points (Paid)
Purchase points directly:
- **Starter**: 100 points - $49
- **Growth**: 250 points - $99 (20% bonus)
- **Pro**: 500 points - $179 (30% bonus)
- **Enterprise**: Custom pricing

## Using Points

### Testing Services
- **Basic test**: 20 points (5 testers)
- **Standard test**: 50 points (10 testers)
- **Premium test**: 100 points (20 testers)
- **Enterprise test**: Custom points

### Additional Services
- Priority support: 10 points/month
- Featured app listing: 25 points
- Expedited testing: +50% points
- Custom test scenarios: Variable

## Point Management

### Checking Your Balance
View your point balance:
- Dashboard header
- Wallet page
- Before each transaction

### Point History
Track all point transactions:
- Points earned
- Points spent
- Bonus points received
- Expiration dates (if any)

### Auto-Reload
Set up automatic point purchases:
- When balance drops below threshold
- Automatic top-up amount
- Payment method on file

## Point Packages Comparison

| Package | Points | Price | Bonus | Best For |
|---------|--------|-------|-------|----------|
| Starter | 100 | $49 | 0% | Testing 1-2 apps |
| Growth | 250 | $99 | 20% | Regular testing |
| Pro | 500 | $179 | 30% | Multiple apps |
| Enterprise | Custom | Custom | 40%+ | Large teams |

## Points Never Expire

Unlike some platforms:
- ✅ Points never expire
- ✅ No monthly fees
- ✅ Use them whenever you need
- ✅ Transfer between projects

## Refund Policy

Unused points are refundable:
- Within 30 days of purchase
- Minus any points already used
- Processed within 5-7 business days

## Tips for Saving Points

1. **Earn before buying** - Test apps first
2. **Buy in bulk** - Larger packages = better value
3. **Use bonuses** - Take advantage of promotions
4. **Plan ahead** - Buy during sales
5. **Refer friends** - Earn bonus points

Questions about points? Check our FAQ or contact support!
    `,
  },
  {
    id: "9",
    title: "Refund and cancellation policy",
    description: "Everything you need to know about refunds and cancellations",
    category: "Billing & Plans",
    slug: "refund-cancellation-policy",
    readTime: "4 min read",
    views: "1.1k",
    publishedAt: "2024-01-16",
    author: {
      name: "Tom Anderson",
      role: "Customer Success",
    },
    content: `
# Refund and Cancellation Policy

We want you to be completely satisfied. Here's our refund and cancellation policy.

## 100% Satisfaction Guarantee

We offer a **7-day satisfaction guarantee** on all testing services:
- Not happy with test results? Get a full refund
- No questions asked within 7 days
- Applies to all testing packages

## Refund Eligibility

### Eligible for Refund
✅ Unused point packages (within 30 days)
✅ Unsatisfactory test results (within 7 days)
✅ Technical issues preventing testing
✅ Duplicate charges
✅ Service not delivered as promised

### Not Eligible for Refund
❌ Points already used for testing
❌ After 30-day window
❌ Tests completed as specified
❌ Change of mind after receiving results

## How to Request a Refund

### Step 1: Contact Support
Email: support@inTesters.com
Include:
- Order number
- Reason for refund
- Any supporting documentation

### Step 2: Review Process
- We review your request within 24 hours
- May ask for additional information
- Decision communicated via email

### Step 3: Refund Processing
- Approved refunds processed within 5-7 business days
- Refunded to original payment method
- Confirmation email sent

## Cancellation Policy

### Subscription Cancellation
- Cancel anytime from account settings
- No cancellation fees
- Access continues until period end
- No automatic renewal after cancellation

### Test Cancellation
- Cancel before testing begins: Full refund
- Cancel during testing: Partial refund
- Cancel after completion: No refund

## Partial Refunds

In some cases, we offer partial refunds:
- Testing partially completed: Prorated refund
- Some testers completed: Points for incomplete tests
- Technical issues: Case-by-case basis

## Dispute Resolution

If you're not satisfied with our decision:
1. Request escalation to senior support
2. Provide additional context
3. We'll review again within 48 hours

## Chargeback Policy

Before filing a chargeback:
- Contact our support team first
- We resolve 99% of issues directly
- Chargebacks may result in account suspension

## Special Circumstances

### Technical Issues
If our platform has technical problems:
- Automatic point credit
- Extended testing time
- Compensation for inconvenience

### Tester No-Shows
If testers don't complete your test:
- Full point refund
- Priority rescheduling
- Bonus points for inconvenience

## Best Practices

To ensure smooth refunds:
1. **Keep documentation** - Save order confirmations
2. **Act quickly** - Request within policy windows
3. **Be specific** - Clearly explain the issue
4. **Provide evidence** - Screenshots help
5. **Stay professional** - We're here to help

## Contact Information

**Email**: support@inTesters.com
**Live Chat**: Available 24/7
**Phone**: +1 (555) 123-4567
**Response Time**: Within 2 hours

We're committed to your satisfaction!
    `,
  },
  {
    id: "10",
    title: "Choosing the right testing package",
    description: "Find the perfect testing package for your app's needs",
    category: "Billing & Plans",
    slug: "choosing-right-testing-package",
    readTime: "6 min read",
    views: "2.2k",
    publishedAt: "2024-01-19",
    author: {
      name: "Chris Martinez",
      role: "Solutions Architect",
    },
    content: `
# Choosing the Right Testing Package

Not sure which testing package is right for you? This guide will help you decide.

## Package Overview

### Basic Package (20 points)
**Best for**: Simple apps, early development
- 5 testers
- Basic functionality testing
- 3-5 day turnaround
- Standard report

### Standard Package (50 points)
**Best for**: Most apps, pre-launch testing
- 10 testers
- Comprehensive testing
- 2-3 day turnaround
- Detailed report with screenshots

### Premium Package (100 points)
**Best for**: Complex apps, critical launches
- 20 testers
- Extensive testing scenarios
- 24-48 hour turnaround
- Video reports + detailed documentation

### Enterprise Package (Custom)
**Best for**: Large organizations, ongoing testing
- Unlimited testers
- Custom test scenarios
- Priority support
- Dedicated account manager

## Decision Factors

### 1. App Complexity

**Simple App** (Basic Package)
- Single purpose
- Few features
- Straightforward UI
- Example: Calculator, timer

**Medium Complexity** (Standard Package)
- Multiple features
- User accounts
- Data storage
- Example: Todo app, note-taking

**Complex App** (Premium Package)
- Many integrated features
- Real-time functionality
- Payment processing
- Example: Social media, e-commerce

### 2. Development Stage

**Early Development** → Basic Package
- Proof of concept
- Alpha testing
- Quick feedback needed

**Pre-Launch** → Standard Package
- Beta testing
- Bug hunting
- UX feedback

**Launch Ready** → Premium Package
- Final validation
- Edge case testing
- Performance testing

### 3. Budget Considerations

**Tight Budget**
- Start with Basic Package
- Use Community Path
- Gradual testing approach

**Moderate Budget**
- Standard Package recommended
- Best value for money
- Covers most needs

**Flexible Budget**
- Premium or Enterprise
- Comprehensive coverage
- Peace of mind

### 4. Timeline

**Flexible Timeline** (3-5 days)
- Basic or Standard Package
- Community Path option
- Lower cost

**Tight Deadline** (24-48 hours)
- Premium Package
- Professional Path
- Expedited service

## Package Comparison

| Feature | Basic | Standard | Premium | Enterprise |
|---------|-------|----------|---------|------------|
| Testers | 5 | 10 | 20 | Unlimited |
| Turnaround | 3-5 days | 2-3 days | 24-48h | Custom |
| Report Type | Basic | Detailed | Video | Custom |
| Support | Email | Email | Priority | Dedicated |
| Price | 20pts | 50pts | 100pts | Custom |

## Add-On Services

Enhance any package with:
- **Expedited Testing**: +50% points, half the time
- **Video Reports**: +20 points, visual bug reports
- **Accessibility Testing**: +30 points, WCAG compliance
- **Performance Testing**: +40 points, load testing
- **Security Audit**: +60 points, vulnerability scan

## Recommendations by App Type

### Gaming Apps
→ **Premium Package**
- Multiple device testing
- Performance critical
- Complex interactions

### Productivity Apps
→ **Standard Package**
- Feature validation
- UX testing
- Cross-platform needs

### Utility Apps
→ **Basic Package**
- Simple functionality
- Quick validation
- Cost-effective

### E-commerce Apps
→ **Premium or Enterprise**
- Payment testing
- Security critical
- High stakes

## Money-Saving Tips

1. **Bundle testing** - Test multiple apps together
2. **Buy point packages** - Bulk discounts available
3. **Use Community Path** - Free alternative
4. **Plan ahead** - Avoid expedited fees
5. **Start small** - Upgrade if needed

## Still Unsure?

Try our **Package Selector Tool**:
1. Answer a few questions about your app
2. Get personalized recommendation
3. See estimated costs
4. Start testing immediately

Or contact our team for a free consultation!

**Email**: sales@inTesters.com
**Chat**: Available 24/7
**Phone**: +1 (555) 123-4567

We'll help you find the perfect fit!
    `,
  },

  // Additional Getting Started Articles (9 more - total 12)
  {
    id: "11",
    title: "First test walkthrough",
    description: "Step-by-step guide to completing your first test",
    category: "Getting Started",
    slug: "first-test-walkthrough",
    readTime: "6 min read",
    views: "1.4k",
    publishedAt: "2024-01-26",
    author: { name: "Sarah Johnson", role: "Product Manager" },
    content:
      "# First Test Walkthrough\n\nComplete your first test with confidence using this detailed guide.\n\n## Before You Start\n- Review test requirements\n- Prepare your device\n- Allocate enough time\n\n## During Testing\n- Follow instructions carefully\n- Document all findings\n- Take screenshots\n\n## After Testing\n- Write detailed report\n- Submit on time\n- Respond to developer questions",
  },
  {
    id: "12",
    title: "Device requirements explained",
    description: "Understanding what devices you need for testing",
    category: "Getting Started",
    slug: "device-requirements-explained",
    readTime: "4 min read",
    views: "1.3k",
    publishedAt: "2024-01-27",
    author: { name: "Mike Chen", role: "Technical Lead" },
    content:
      "# Device Requirements Explained\n\nLearn what devices are needed for different types of testing.\n\n## Minimum Requirements\n- Modern smartphone (last 3 years)\n- Updated operating system\n- Stable internet connection\n\n## Recommended Setup\n- Multiple devices\n- Different OS versions\n- Various screen sizes",
  },
  {
    id: "13",
    title: "Testing best practices",
    description: "Pro tips for becoming a better tester",
    category: "Getting Started",
    slug: "testing-best-practices",
    readTime: "5 min read",
    views: "1.7k",
    publishedAt: "2024-01-28",
    author: { name: "Emily Rodriguez", role: "QA Specialist" },
    content:
      "# Testing Best Practices\n\nElevate your testing skills with these professional tips.\n\n## Quality Over Quantity\n- Take your time\n- Be thorough\n- Document everything\n\n## Communication\n- Clear reports\n- Timely responses\n- Professional tone",
  },
  {
    id: "14",
    title: "Common testing mistakes",
    description: "Avoid these frequent errors when testing apps",
    category: "Getting Started",
    slug: "common-testing-mistakes",
    readTime: "4 min read",
    views: "1.2k",
    publishedAt: "2024-01-29",
    author: { name: "Sarah Johnson", role: "Product Manager" },
    content:
      "# Common Testing Mistakes\n\nLearn from others' mistakes and improve your testing quality.\n\n## Top Mistakes\n- Rushing through tests\n- Vague bug reports\n- Not following instructions\n- Skipping edge cases\n\n## How to Avoid Them\n- Read requirements twice\n- Use templates\n- Test systematically",
  },
  {
    id: "15",
    title: "Understanding test types",
    description: "Different types of tests and what they involve",
    category: "Getting Started",
    slug: "understanding-test-types",
    readTime: "5 min read",
    views: "1.5k",
    publishedAt: "2024-01-30",
    author: { name: "Mike Chen", role: "Technical Lead" },
    content:
      "# Understanding Test Types\n\nExplore different testing methodologies.\n\n## Functional Testing\n- Feature verification\n- User flow testing\n- Integration testing\n\n## Non-Functional Testing\n- Performance\n- Security\n- Usability",
  },
  {
    id: "16",
    title: "Bug reporting guidelines",
    description: "How to write effective bug reports",
    category: "Getting Started",
    slug: "bug-reporting-guidelines",
    readTime: "6 min read",
    views: "1.8k",
    publishedAt: "2024-02-01",
    author: { name: "Emily Rodriguez", role: "QA Specialist" },
    content:
      "# Bug Reporting Guidelines\n\nMaster the art of writing clear, actionable bug reports.\n\n## Essential Elements\n- Clear title\n- Steps to reproduce\n- Expected vs actual\n- Screenshots/videos\n- Device information\n\n## Report Template\nUse our standard template for consistency.",
  },
  {
    id: "17",
    title: "Time management for testers",
    description: "Maximize efficiency while maintaining quality",
    category: "Getting Started",
    slug: "time-management-for-testers",
    readTime: "4 min read",
    views: "1.1k",
    publishedAt: "2024-02-02",
    author: { name: "Sarah Johnson", role: "Product Manager" },
    content:
      "# Time Management for Testers\n\nBalance speed and quality effectively.\n\n## Planning\n- Estimate time needed\n- Schedule testing blocks\n- Prioritize tasks\n\n## Execution\n- Focus on one test at a time\n- Use checklists\n- Minimize distractions",
  },
  {
    id: "18",
    title: "Building your testing portfolio",
    description: "Showcase your skills and attract better opportunities",
    category: "Getting Started",
    slug: "building-testing-portfolio",
    readTime: "5 min read",
    views: "1.3k",
    publishedAt: "2024-02-03",
    author: { name: "Mike Chen", role: "Technical Lead" },
    content:
      "# Building Your Testing Portfolio\n\nCreate a compelling portfolio to stand out.\n\n## What to Include\n- Test reports samples\n- Bug findings\n- Certifications\n- Testimonials\n\n## Presentation\n- Professional format\n- Clear organization\n- Regular updates",
  },
  {
    id: "19",
    title: "Tester rating system explained",
    description: "How ratings work and how to improve yours",
    category: "Getting Started",
    slug: "tester-rating-system",
    readTime: "4 min read",
    views: "1.6k",
    publishedAt: "2024-02-04",
    author: { name: "Emily Rodriguez", role: "QA Specialist" },
    content:
      "# Tester Rating System Explained\n\nUnderstand how ratings impact your opportunities.\n\n## Rating Factors\n- Report quality\n- Timeliness\n- Communication\n- Accuracy\n\n## Improving Your Rating\n- Consistent quality\n- Meet deadlines\n- Professional conduct",
  },

  // Additional Account & Security Articles (6 more - total 8)
  {
    id: "20",
    title: "Password security best practices",
    description: "Create and manage strong passwords",
    category: "Account & Security",
    slug: "password-security-best-practices",
    readTime: "4 min read",
    views: "1.4k",
    publishedAt: "2024-02-05",
    author: { name: "David Park", role: "Security Engineer" },
    content:
      "# Password Security Best Practices\n\nProtect your account with strong passwords.\n\n## Creating Strong Passwords\n- Minimum 12 characters\n- Mix of characters\n- Unique for each account\n- Use password manager\n\n## What to Avoid\n- Common words\n- Personal information\n- Reusing passwords",
  },
  {
    id: "21",
    title: "Recognizing phishing attempts",
    description: "Stay safe from scams and fraud",
    category: "Account & Security",
    slug: "recognizing-phishing-attempts",
    readTime: "5 min read",
    views: "1.2k",
    publishedAt: "2024-02-06",
    author: { name: "David Park", role: "Security Engineer" },
    content:
      "# Recognizing Phishing Attempts\n\nProtect yourself from email and message scams.\n\n## Warning Signs\n- Suspicious sender\n- Urgent requests\n- Poor grammar\n- Unexpected attachments\n\n## What to Do\n- Verify sender\n- Don't click links\n- Report suspicious emails",
  },
  {
    id: "22",
    title: "Account recovery process",
    description: "Regain access if you're locked out",
    category: "Account & Security",
    slug: "account-recovery-process",
    readTime: "4 min read",
    views: "1.0k",
    publishedAt: "2024-02-07",
    author: { name: "Lisa Wang", role: "Product Designer" },
    content:
      "# Account Recovery Process\n\nRecover your account quickly and securely.\n\n## Recovery Methods\n- Email verification\n- Phone verification\n- Security questions\n- Support ticket\n\n## Prevention\n- Keep contact info updated\n- Save backup codes\n- Enable 2FA",
  },
  {
    id: "23",
    title: "Privacy settings guide",
    description: "Control what information you share",
    category: "Account & Security",
    slug: "privacy-settings-guide",
    readTime: "5 min read",
    views: "1.1k",
    publishedAt: "2024-02-08",
    author: { name: "Lisa Wang", role: "Product Designer" },
    content:
      "# Privacy Settings Guide\n\nManage your privacy preferences effectively.\n\n## Profile Privacy\n- Public vs private\n- Information visibility\n- Search settings\n\n## Data Sharing\n- Analytics opt-out\n- Third-party sharing\n- Marketing preferences",
  },
  {
    id: "24",
    title: "Session management",
    description: "Manage active sessions and devices",
    category: "Account & Security",
    slug: "session-management",
    readTime: "3 min read",
    views: "0.9k",
    publishedAt: "2024-02-09",
    author: { name: "David Park", role: "Security Engineer" },
    content:
      "# Session Management\n\nMonitor and control your active sessions.\n\n## Viewing Sessions\n- Active devices\n- Login locations\n- Session duration\n\n## Security Actions\n- End suspicious sessions\n- Enable notifications\n- Regular reviews",
  },
  {
    id: "25",
    title: "Data export and portability",
    description: "Download your data anytime",
    category: "Account & Security",
    slug: "data-export-portability",
    readTime: "4 min read",
    views: "0.8k",
    publishedAt: "2024-02-10",
    author: { name: "Lisa Wang", role: "Product Designer" },
    content:
      "# Data Export and Portability\n\nAccess and download your personal data.\n\n## What You Can Export\n- Profile information\n- Test history\n- Transaction records\n- Communications\n\n## Export Process\n- Request export\n- Wait for processing\n- Download securely",
  },

  // Additional Community Hub Articles (13 more - total 15)
  {
    id: "26",
    title: "Networking in the community",
    description: "Build relationships with other testers and developers",
    category: "Community Hub",
    slug: "networking-in-community",
    readTime: "5 min read",
    views: "1.3k",
    publishedAt: "2024-02-11",
    author: { name: "Alex Thompson", role: "Community Manager" },
    content:
      "# Networking in the Community\n\nBuild valuable connections in the testing community.\n\n## Benefits of Networking\n- Learn from others\n- Get referrals\n- Collaborate on projects\n- Stay informed\n\n## How to Network\n- Participate in forums\n- Attend events\n- Share knowledge\n- Be helpful",
  },
  {
    id: "27",
    title: "Community guidelines and rules",
    description: "Understand our community standards",
    category: "Community Hub",
    slug: "community-guidelines-rules",
    readTime: "4 min read",
    views: "1.1k",
    publishedAt: "2024-02-12",
    author: { name: "Alex Thompson", role: "Community Manager" },
    content:
      "# Community Guidelines and Rules\n\nMaintain a positive, professional community.\n\n## Core Values\n- Respect\n- Honesty\n- Professionalism\n- Collaboration\n\n## Prohibited Behavior\n- Harassment\n- Spam\n- Fraud\n- Plagiarism",
  },
  {
    id: "28",
    title: "Finding the right tests",
    description: "Match your skills with appropriate testing opportunities",
    category: "Community Hub",
    slug: "finding-right-tests",
    readTime: "5 min read",
    views: "1.5k",
    publishedAt: "2024-02-13",
    author: { name: "Jordan Lee", role: "Community Lead" },
    content:
      "# Finding the Right Tests\n\nChoose tests that match your expertise.\n\n## Filtering Options\n- By category\n- By points\n- By duration\n- By difficulty\n\n## Matching Skills\n- Review requirements\n- Check device needs\n- Assess time commitment",
  },
  {
    id: "29",
    title: "Tester leaderboards explained",
    description: "How rankings work and how to climb them",
    category: "Community Hub",
    slug: "tester-leaderboards-explained",
    readTime: "4 min read",
    views: "1.2k",
    publishedAt: "2024-02-14",
    author: { name: "Jordan Lee", role: "Community Lead" },
    content:
      "# Tester Leaderboards Explained\n\nUnderstand the ranking system and compete.\n\n## Ranking Factors\n- Tests completed\n- Quality ratings\n- Response time\n- Consistency\n\n## Benefits of High Rank\n- Priority access\n- Bonus points\n- Recognition\n- Better opportunities",
  },
  {
    id: "30",
    title: "Collaboration features",
    description: "Work with other testers on complex projects",
    category: "Community Hub",
    slug: "collaboration-features",
    readTime: "5 min read",
    views: "1.0k",
    publishedAt: "2024-02-15",
    author: { name: "Alex Thompson", role: "Community Manager" },
    content:
      "# Collaboration Features\n\nTeam up for better testing outcomes.\n\n## Team Testing\n- Create teams\n- Share workload\n- Pool expertise\n- Split rewards\n\n## Communication Tools\n- Team chat\n- Shared notes\n- Task assignment",
  },
  {
    id: "31",
    title: "Feedback and reviews",
    description: "Give and receive constructive feedback",
    category: "Community Hub",
    slug: "feedback-and-reviews",
    readTime: "4 min read",
    views: "0.9k",
    publishedAt: "2024-02-16",
    author: { name: "Jordan Lee", role: "Community Lead" },
    content:
      "# Feedback and Reviews\n\nProvide and receive valuable feedback.\n\n## Giving Feedback\n- Be specific\n- Be constructive\n- Be timely\n- Be professional\n\n## Receiving Feedback\n- Stay open-minded\n- Ask questions\n- Implement suggestions\n- Thank reviewers",
  },
  {
    id: "32",
    title: "Community events and challenges",
    description: "Participate in special events for extra rewards",
    category: "Community Hub",
    slug: "community-events-challenges",
    readTime: "5 min read",
    views: "1.4k",
    publishedAt: "2024-02-17",
    author: { name: "Alex Thompson", role: "Community Manager" },
    content:
      "# Community Events and Challenges\n\nJoin events for fun and rewards.\n\n## Event Types\n- Testing marathons\n- Bug hunts\n- Skill challenges\n- Seasonal events\n\n## Rewards\n- Bonus points\n- Badges\n- Prizes\n- Recognition",
  },
  {
    id: "33",
    title: "Mentorship program",
    description: "Learn from experienced testers or become a mentor",
    category: "Community Hub",
    slug: "mentorship-program",
    readTime: "4 min read",
    views: "1.1k",
    publishedAt: "2024-02-18",
    author: { name: "Jordan Lee", role: "Community Lead" },
    content:
      "# Mentorship Program\n\nGrow through mentorship relationships.\n\n## For Mentees\n- Find a mentor\n- Set goals\n- Regular check-ins\n- Apply learnings\n\n## For Mentors\n- Share experience\n- Guide newcomers\n- Earn recognition\n- Give back",
  },
  {
    id: "34",
    title: "Dispute resolution process",
    description: "Handle conflicts professionally",
    category: "Community Hub",
    slug: "dispute-resolution-process",
    readTime: "4 min read",
    views: "0.8k",
    publishedAt: "2024-02-19",
    author: { name: "Alex Thompson", role: "Community Manager" },
    content:
      "# Dispute Resolution Process\n\nResolve conflicts fairly and professionally.\n\n## Common Disputes\n- Payment issues\n- Quality disagreements\n- Communication problems\n\n## Resolution Steps\n- Direct communication\n- Mediation\n- Support escalation\n- Final decision",
  },
  {
    id: "35",
    title: "Community forum guide",
    description: "Make the most of our discussion forums",
    category: "Community Hub",
    slug: "community-forum-guide",
    readTime: "5 min read",
    views: "1.0k",
    publishedAt: "2024-02-20",
    author: { name: "Jordan Lee", role: "Community Lead" },
    content:
      "# Community Forum Guide\n\nEngage effectively in community discussions.\n\n## Forum Sections\n- General discussion\n- Technical help\n- Feature requests\n- Announcements\n\n## Best Practices\n- Search before posting\n- Use clear titles\n- Stay on topic\n- Be respectful",
  },
  {
    id: "36",
    title: "Tester badges and achievements",
    description: "Earn recognition for your accomplishments",
    category: "Community Hub",
    slug: "tester-badges-achievements",
    readTime: "4 min read",
    views: "1.3k",
    publishedAt: "2024-02-21",
    author: { name: "Alex Thompson", role: "Community Manager" },
    content:
      "# Tester Badges and Achievements\n\nShowcase your testing milestones.\n\n## Badge Types\n- Milestone badges\n- Skill badges\n- Special event badges\n- Exclusive badges\n\n## Benefits\n- Profile enhancement\n- Community recognition\n- Unlock features\n- Bonus opportunities",
  },
  {
    id: "37",
    title: "Seasonal testing opportunities",
    description: "Take advantage of peak testing seasons",
    category: "Community Hub",
    slug: "seasonal-testing-opportunities",
    readTime: "5 min read",
    views: "1.2k",
    publishedAt: "2024-02-22",
    author: { name: "Jordan Lee", role: "Community Lead" },
    content:
      "# Seasonal Testing Opportunities\n\nMaximize earnings during peak seasons.\n\n## Peak Seasons\n- Holiday season\n- Back to school\n- Summer apps\n- Tax season\n\n## Preparation\n- Update availability\n- Expand skills\n- Build reputation\n- Stay flexible",
  },
  {
    id: "38",
    title: "Beta testing programs",
    description: "Get early access to new features",
    category: "Community Hub",
    slug: "beta-testing-programs",
    readTime: "4 min read",
    views: "1.1k",
    publishedAt: "2024-02-23",
    author: { name: "Alex Thompson", role: "Community Manager" },
    content:
      "# Beta Testing Programs\n\nJoin exclusive beta testing opportunities.\n\n## What is Beta Testing\n- Early feature access\n- Provide feedback\n- Shape development\n- Earn rewards\n\n## How to Join\n- Meet requirements\n- Apply for programs\n- Sign NDA\n- Active participation",
  },

  // Additional Billing & Plans Articles (7 more - total 10)
  {
    id: "39",
    title: "Payment methods accepted",
    description: "All the ways you can pay for services",
    category: "Billing & Plans",
    slug: "payment-methods-accepted",
    readTime: "3 min read",
    views: "1.0k",
    publishedAt: "2024-02-24",
    author: { name: "Rachel Green", role: "Finance Manager" },
    content:
      "# Payment Methods Accepted\n\nChoose from multiple payment options.\n\n## Accepted Methods\n- Credit/debit cards\n- PayPal\n- Bank transfer\n- Digital wallets\n\n## Payment Security\n- PCI compliant\n- Encrypted transactions\n- Fraud protection\n- Secure storage",
  },
  {
    id: "40",
    title: "Subscription plans comparison",
    description: "Find the perfect plan for your needs",
    category: "Billing & Plans",
    slug: "subscription-plans-comparison",
    readTime: "5 min read",
    views: "1.5k",
    publishedAt: "2024-02-25",
    author: { name: "Chris Martinez", role: "Solutions Architect" },
    content:
      "# Subscription Plans Comparison\n\nCompare all available subscription tiers.\n\n## Plan Features\n- Free tier\n- Basic plan\n- Pro plan\n- Enterprise plan\n\n## Choosing Right Plan\n- Assess needs\n- Compare features\n- Consider growth\n- Try before buying",
  },
  {
    id: "41",
    title: "Billing cycle and invoices",
    description: "Understanding your billing schedule",
    category: "Billing & Plans",
    slug: "billing-cycle-invoices",
    readTime: "4 min read",
    views: "0.9k",
    publishedAt: "2024-02-26",
    author: { name: "Rachel Green", role: "Finance Manager" },
    content:
      "# Billing Cycle and Invoices\n\nManage your billing effectively.\n\n## Billing Cycles\n- Monthly billing\n- Annual billing\n- Pay-as-you-go\n\n## Invoice Management\n- Download invoices\n- Payment history\n- Tax information\n- Receipt storage",
  },
  {
    id: "42",
    title: "Upgrading and downgrading plans",
    description: "Change your subscription anytime",
    category: "Billing & Plans",
    slug: "upgrading-downgrading-plans",
    readTime: "4 min read",
    views: "1.1k",
    publishedAt: "2024-02-27",
    author: { name: "Tom Anderson", role: "Customer Success" },
    content:
      "# Upgrading and Downgrading Plans\n\nFlexibly adjust your subscription.\n\n## Upgrading\n- Immediate access\n- Prorated billing\n- Keep existing data\n\n## Downgrading\n- End of billing cycle\n- Feature limitations\n- Data retention",
  },
  {
    id: "43",
    title: "Enterprise pricing options",
    description: "Custom solutions for large teams",
    category: "Billing & Plans",
    slug: "enterprise-pricing-options",
    readTime: "5 min read",
    views: "0.8k",
    publishedAt: "2024-02-28",
    author: { name: "Chris Martinez", role: "Solutions Architect" },
    content:
      "# Enterprise Pricing Options\n\nTailored solutions for organizations.\n\n## Enterprise Features\n- Unlimited users\n- Custom integrations\n- Dedicated support\n- SLA guarantees\n\n## Getting Started\n- Contact sales\n- Custom quote\n- Contract negotiation\n- Onboarding support",
  },
  {
    id: "44",
    title: "Promotional codes and discounts",
    description: "Save money with special offers",
    category: "Billing & Plans",
    slug: "promotional-codes-discounts",
    readTime: "3 min read",
    views: "1.2k",
    publishedAt: "2024-03-01",
    author: { name: "Rachel Green", role: "Finance Manager" },
    content:
      "# Promotional Codes and Discounts\n\nMaximize savings with promo codes.\n\n## Finding Codes\n- Email newsletters\n- Social media\n- Partner offers\n- Seasonal sales\n\n## Applying Codes\n- At checkout\n- Account settings\n- One-time use\n- Expiration dates",
  },
  {
    id: "45",
    title: "Tax and compliance information",
    description: "Important tax details for your transactions",
    category: "Billing & Plans",
    slug: "tax-compliance-information",
    readTime: "4 min read",
    views: "0.7k",
    publishedAt: "2024-03-02",
    author: { name: "Tom Anderson", role: "Customer Success" },
    content:
      "# Tax and Compliance Information\n\nUnderstand tax implications and compliance.\n\n## Tax Details\n- VAT/GST handling\n- Tax ID requirements\n- Invoice compliance\n- Regional variations\n\n## Documentation\n- Tax receipts\n- Annual statements\n- Compliance reports\n- Audit support",
  },
];

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((article) => article.category === category);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(articles.map((article) => article.category)));
}

export function getPopularArticles(limit: number = 4): Article[] {
  return articles
    .sort((a, b) => {
      const viewsA = parseFloat(a.views.replace("k", "")) * 1000;
      const viewsB = parseFloat(b.views.replace("k", "")) * 1000;
      return viewsB - viewsA;
    })
    .slice(0, limit);
}
