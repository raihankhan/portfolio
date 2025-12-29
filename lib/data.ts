export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  technologies: string[]
  challenges: string[]
  outcomes: string[]
  links: {
    github?: string
    demo?: string
    docs?: string
  }
  image: string
  featured: boolean
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  tags: string[]
  readingTime: string
}

export interface Note {
  slug: string
  title: string
  category: string
  content: string
  updatedAt: string
}

export interface Experience {
  id: string
  role: string
  company: string
  companyUrl?: string
  location: string
  startDate: string
  endDate: string | null
  description: string
  achievements: string[]
  technologies: string[]
}

export interface FeedPost {
  id: string
  content: string
  timestamp: string
  media?: {
    type: "iframe"
    src: string
    aspectRatio?: string
  }
}

export const feedPosts: FeedPost[] = [
  {
    id: "platform-engineering-golang-webinar",
    content: "Just wrapped up a webinar on Platform Engineering with Golang! We explored how Go's currency model and performance make it an ideal choice for building robust platform tools. Check out the slides below for a deep dive into the architecture and code examples.",
    timestamp: "2025-12-29T10:00:00Z", // Using current date as placeholder
    media: {
      type: "iframe",
      src: "https://app.presentations.ai/view/BYSzxx2aRK",
      aspectRatio: "aspect-[4/3]",
    },
  },
]

export const projects: Project[] = [
  {
    id: "kubernetes-platform",
    title: "Enterprise Kubernetes Platform",
    description:
      "Multi-tenant Kubernetes platform with GitOps workflows, automated scaling, and comprehensive monitoring.",
    longDescription:
      "Designed and implemented a production-grade Kubernetes platform serving 50+ development teams. The platform features automated cluster provisioning, multi-tenancy isolation, GitOps-based deployments with ArgoCD, and comprehensive observability with Prometheus/Grafana.",
    technologies: ["Kubernetes", "Terraform", "ArgoCD", "Prometheus", "Grafana", "Helm", "AWS EKS"],
    challenges: [
      "Implementing secure multi-tenancy without performance overhead",
      "Managing hundreds of microservices deployments",
      "Achieving 99.99% uptime SLA",
    ],
    outcomes: [
      "Reduced deployment time from hours to minutes",
      "Achieved 99.99% platform availability",
      "Onboarded 50+ teams with zero security incidents",
    ],
    links: {
      github: "https://github.com",
      docs: "https://docs.example.com",
    },
    image: "/kubernetes-dashboard-with-metrics.jpg",
    featured: true,
  },
  {
    id: "cicd-pipeline",
    title: "Self-Service CI/CD Platform",
    description: "GitHub Actions-based CI/CD platform with automated security scanning and deployment gates.",
    longDescription:
      "Built a self-service CI/CD platform that enables developers to deploy applications without DevOps intervention. Features include automated security scanning, compliance checks, and progressive deployment strategies.",
    technologies: ["GitHub Actions", "Docker", "Trivy", "SonarQube", "AWS", "Terraform"],
    challenges: [
      "Balancing developer autonomy with security requirements",
      "Implementing consistent deployment standards across 100+ repositories",
      "Managing secrets securely at scale",
    ],
    outcomes: [
      "90% reduction in deployment-related tickets",
      "100% of deployments include security scanning",
      "Average deployment time under 10 minutes",
    ],
    links: {
      github: "https://github.com",
    },
    image: "/ci-cd-pipeline.png",
    featured: true,
  },
  {
    id: "infrastructure-as-code",
    title: "Multi-Cloud IaC Framework",
    description: "Terraform-based infrastructure framework supporting AWS, GCP, and Azure with built-in compliance.",
    longDescription:
      "Developed a comprehensive Infrastructure as Code framework that standardizes cloud resource provisioning across multiple providers. Includes pre-built modules, policy-as-code enforcement, and automated cost optimization.",
    technologies: ["Terraform", "AWS", "GCP", "Azure", "OPA", "Sentinel", "Python"],
    challenges: [
      "Abstracting provider differences for consistent developer experience",
      "Implementing drift detection and auto-remediation",
      "Enforcing compliance policies without blocking deployments",
    ],
    outcomes: [
      "40% reduction in cloud costs through optimization",
      "Zero compliance violations in production",
      "Infrastructure provisioning time reduced by 80%",
    ],
    links: {
      github: "https://github.com",
      docs: "https://docs.example.com",
    },
    image: "/terraform-cloud-infrastructure-diagram.jpg",
    featured: true,
  },
  {
    id: "observability-stack",
    title: "Unified Observability Platform",
    description: "Centralized logging, metrics, and tracing platform with AI-powered anomaly detection.",
    longDescription:
      "Implemented a comprehensive observability platform that correlates logs, metrics, and traces. Features include custom dashboards, automated alerting, and machine learning-based anomaly detection for proactive incident management.",
    technologies: ["Prometheus", "Grafana", "Loki", "Tempo", "OpenTelemetry", "Python", "Kubernetes"],
    challenges: [
      "Handling petabytes of observability data efficiently",
      "Reducing alert fatigue while maintaining coverage",
      "Correlating signals across distributed systems",
    ],
    outcomes: [
      "MTTR reduced from 4 hours to 30 minutes",
      "95% reduction in false-positive alerts",
      "Full stack visibility for 200+ services",
    ],
    links: {
      github: "https://github.com",
    },
    image: "/monitoring-dashboard-grafana.jpg",
    featured: false,
  },
]

export const blogPosts: BlogPost[] = [
  {
    slug: "kubernetes-best-practices-2024",
    title: "Kubernetes Best Practices for Production in 2024",
    excerpt:
      "A comprehensive guide to running Kubernetes in production, covering security, scalability, and operational excellence.",
    content: `
# Kubernetes Best Practices for Production in 2024

Running Kubernetes in production requires careful attention to security, scalability, and operational practices. In this post, I'll share lessons learned from managing large-scale Kubernetes deployments.

## Security First

Security in Kubernetes starts with the principle of least privilege. Here's how to implement it:

\`\`\`yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-service-account
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: app-role
rules:
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list"]
\`\`\`

## Resource Management

Always define resource requests and limits:

\`\`\`yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"
\`\`\`

## Pod Disruption Budgets

Ensure high availability during updates with PDBs:

\`\`\`yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: app-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: my-app
\`\`\`

## Conclusion

Following these practices will significantly improve your Kubernetes operations.
    `,
    publishedAt: "2024-03-15",
    tags: ["Kubernetes", "DevOps", "Security", "Best Practices"],
    readingTime: "8 min read",
  },
  {
    slug: "terraform-modules-at-scale",
    title: "Building Terraform Modules at Scale",
    excerpt:
      "Learn how to design, test, and maintain Terraform modules that work across multiple teams and cloud providers.",
    content: `
# Building Terraform Modules at Scale

When your infrastructure grows, managing Terraform becomes increasingly complex. Here's how to build modules that scale.

## Module Structure

A well-structured module follows this pattern:

\`\`\`
modules/
├── networking/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── versions.tf
│   └── README.md
└── compute/
    └── ...
\`\`\`

## Input Validation

Always validate inputs to prevent misconfigurations:

\`\`\`hcl
variable "environment" {
  type        = string
  description = "Deployment environment"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}
\`\`\`

## Testing with Terratest

Automated testing is essential:

\`\`\`go
func TestNetworkingModule(t *testing.T) {
    terraformOptions := &terraform.Options{
        TerraformDir: "../modules/networking",
        Vars: map[string]interface{}{
            "environment": "test",
            "vpc_cidr":    "10.0.0.0/16",
        },
    }
    
    defer terraform.Destroy(t, terraformOptions)
    terraform.InitAndApply(t, terraformOptions)
}
\`\`\`

## Conclusion

Well-designed modules reduce complexity and enable teams to move faster.
    `,
    publishedAt: "2024-02-20",
    tags: ["Terraform", "IaC", "AWS", "DevOps"],
    readingTime: "6 min read",
  },
  {
    slug: "gitops-with-argocd",
    title: "Implementing GitOps with ArgoCD",
    excerpt: "A practical guide to implementing GitOps workflows using ArgoCD for Kubernetes deployments.",
    content: `
# Implementing GitOps with ArgoCD

GitOps brings the benefits of version control to your infrastructure. ArgoCD makes it easy to implement.

## What is GitOps?

GitOps is an operational framework that takes DevOps best practices for application development and applies them to infrastructure automation.

## Setting Up ArgoCD

Install ArgoCD in your cluster:

\`\`\`bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
\`\`\`

## Application Definition

Define your application declaratively:

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/repo
    targetRevision: HEAD
    path: kubernetes/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
\`\`\`

## Benefits

- **Audit Trail**: Every change is tracked in Git
- **Rollback**: Easy rollback to any previous state
- **Consistency**: Single source of truth for deployments
    `,
    publishedAt: "2024-01-10",
    tags: ["GitOps", "ArgoCD", "Kubernetes", "CI/CD"],
    readingTime: "5 min read",
  },
]

export const notes: Note[] = [
  {
    slug: "kubernetes-kubectl-commands",
    title: "Essential kubectl Commands",
    category: "Kubernetes",
    content: `
# Essential kubectl Commands

Quick reference for commonly used kubectl commands.

## Cluster Information

\`\`\`bash
# Get cluster info
kubectl cluster-info

# View nodes
kubectl get nodes -o wide

# Check component status
kubectl get componentstatuses
\`\`\`

## Working with Pods

\`\`\`bash
# List pods in all namespaces
kubectl get pods -A

# Describe a pod
kubectl describe pod <pod-name> -n <namespace>

# View pod logs
kubectl logs <pod-name> -n <namespace> -f

# Execute command in pod
kubectl exec -it <pod-name> -n <namespace> -- /bin/bash
\`\`\`

## Debugging

\`\`\`bash
# Get events
kubectl get events --sort-by=.metadata.creationTimestamp

# Debug with ephemeral container
kubectl debug -it <pod-name> --image=busybox
\`\`\`
    `,
    updatedAt: "2024-03-01",
  },
  {
    slug: "golang-concurrency-patterns",
    title: "Go Concurrency Patterns",
    category: "Golang",
    content: `
# Go Concurrency Patterns

Common patterns for concurrent programming in Go.

## Worker Pool

\`\`\`go
func workerPool(jobs <-chan int, results chan<- int) {
    for j := range jobs {
        results <- process(j)
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    // Start workers
    for w := 1; w <= 3; w++ {
        go workerPool(jobs, results)
    }
    
    // Send jobs
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
}
\`\`\`

## Fan-Out, Fan-In

\`\`\`go
func fanOut(input <-chan int, n int) []<-chan int {
    outputs := make([]<-chan int, n)
    for i := 0; i < n; i++ {
        outputs[i] = worker(input)
    }
    return outputs
}

func fanIn(channels ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    merged := make(chan int)
    
    for _, ch := range channels {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for v := range c {
                merged <- v
            }
        }(ch)
    }
    
    go func() {
        wg.Wait()
        close(merged)
    }()
    
    return merged
}
\`\`\`
    `,
    updatedAt: "2024-02-15",
  },
  {
    slug: "terraform-state-management",
    title: "Terraform State Management",
    category: "Terraform",
    content: `
# Terraform State Management

Best practices for managing Terraform state in teams.

## Remote State with S3

\`\`\`hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
\`\`\`

## State Locking

Always use DynamoDB for state locking:

\`\`\`hcl
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }
}
\`\`\`

## Workspaces

Use workspaces for environment separation:

\`\`\`bash
terraform workspace new staging
terraform workspace select staging
terraform apply
\`\`\`
    `,
    updatedAt: "2024-01-20",
  },
]

export const experiences: Experience[] = [
  {
    id: "senior-devops-current",
    role: "Senior DevOps Engineer",
    company: "TechCorp Inc.",
    companyUrl: "https://example.com",
    location: "San Francisco, CA",
    startDate: "2022-01",
    endDate: null,
    description:
      "Leading the platform engineering team responsible for cloud infrastructure, CI/CD pipelines, and developer experience.",
    achievements: [
      "Architected and deployed a multi-region Kubernetes platform serving 100+ microservices",
      "Reduced infrastructure costs by 40% through optimization and right-sizing",
      "Implemented GitOps workflows reducing deployment failures by 90%",
      "Built self-service developer platform reducing time-to-production by 60%",
    ],
    technologies: ["Kubernetes", "AWS", "Terraform", "ArgoCD", "GitHub Actions", "Prometheus", "Grafana"],
  },
  {
    id: "devops-engineer",
    role: "DevOps Engineer",
    company: "CloudScale Systems",
    companyUrl: "https://example.com",
    location: "Seattle, WA",
    startDate: "2019-06",
    endDate: "2021-12",
    description: "Responsible for cloud infrastructure automation, monitoring, and incident response.",
    achievements: [
      "Migrated legacy applications to containerized microservices on EKS",
      "Designed and implemented comprehensive monitoring stack with 99.9% visibility",
      "Automated infrastructure provisioning reducing setup time from days to hours",
      "Led incident response team achieving 99.95% uptime SLA",
    ],
    technologies: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "ELK Stack", "Python"],
  },
  {
    id: "systems-engineer",
    role: "Systems Engineer",
    company: "DataFlow Labs",
    location: "Austin, TX",
    startDate: "2017-03",
    endDate: "2019-05",
    description: "Managed on-premise and cloud hybrid infrastructure for data processing pipelines.",
    achievements: [
      "Designed hybrid cloud architecture connecting on-premise data centers with AWS",
      "Implemented automated backup and disaster recovery solutions",
      "Reduced system downtime by 70% through proactive monitoring",
      "Managed infrastructure supporting 50TB+ daily data processing",
    ],
    technologies: ["Linux", "VMware", "AWS", "Ansible", "Nagios", "MySQL", "Redis"],
  },
]
