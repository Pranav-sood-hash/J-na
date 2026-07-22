import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Play, Award, Globe, X, Loader2, Github } from 'lucide-react';
import { usePortfolioContent, PortfolioContent } from '@/hooks/usePortfolioContent';
import { isVideoUrl } from '@/utils/mediaUtils';

// Fallback certificate images for migration
import awsCert from '@/assets/certificates/aws-solutions-architecture.png';
import kaggleCert from '@/assets/certificates/kaggle-vampire.png';
import oracleCert from '@/assets/certificates/oracle-ai-foundations.png';
import hackUPCert from '@/assets/certificates/hack-uttarpradesh.png';
import googleCloudCert from '@/assets/certificates/google-cloud-agentic-ai.png';
import triwizardathonCert from '@/assets/certificates/triwizardathon.png';
import myJobGrowAICert from '@/assets/certificates/myjobgrow-ai-course.png';
import myJobGrowInternCert from '@/assets/certificates/myjobgrow-techfest-internship.png';

gsap.registerPlugin(ScrollTrigger);

// Legacy static projects for backwards compatibility
interface LegacyProject {
  id: string;
  title: string;
  category: 'video' | 'website' | 'certificate';
  description: string;
  image?: string;
  link?: string;
  tech?: string[];
}

const legacyProjects: LegacyProject[] = [
  {
    id: '3',
    title: 'AWS Solutions Architecture Job Simulation',
    category: 'certificate',
    description: 'Certificate of Completion from AWS & Forage. Completed practical tasks in designing a simple, scalable, hosting architecture over October to November 2025.',
    tech: ['AWS', 'Cloud Architecture', 'Forage'],
    image: awsCert,
  },
  {
    id: '4',
    title: 'Kaggle Vampire Badge',
    category: 'certificate',
    description: 'Badge Certificate from Kaggle. Successfully earned the Vampire badge on Kaggle platform.',
    tech: ['Kaggle', 'Data Science'],
    image: kaggleCert,
  },
  {
    id: '5',
    title: 'Oracle Certified Foundations Associate',
    category: 'certificate',
    description: 'Certificate of Recognition from Oracle University. Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate. Recognized by Oracle Corporation as Oracle Certified.',
    tech: ['Oracle', 'AI', 'Cloud Infrastructure'],
    image: oracleCert,
  },
  {
    id: '6',
    title: 'Hack with UttarPradesh 2025',
    category: 'certificate',
    description: 'Certificate of Participation. Actively participated in Hack with UttarPradesh 2025, held on 1st & 2nd November, contributing to innovation, collaboration, & problem-solving. Presented by Chandigarh University Technology Business Incubator.',
    tech: ['Hackathon', 'Innovation', 'Problem Solving'],
    image: hackUPCert,
  },
  {
    id: '7',
    title: 'Google Cloud Agentic AI Day',
    category: 'certificate',
    description: 'Certificate of Participation from Google Cloud & Hack2skill. Recognized for initiative and contribution to the Agentic AI Day, joining a community of changemakers harnessing Agentic AI to address real-world problems.',
    tech: ['Google Cloud', 'Agentic AI', 'Hack2skill'],
    image: googleCloudCert,
  },
  {
    id: '8',
    title: 'Triwizardathon 1.0 Finalist',
    category: 'certificate',
    description: 'Certificate of Participation for successfully qualifying for the Finale Round of Triwizardathon 1.0 organized by Microsoft Learn Student Ambassador - GLA University Chapter, held on 2nd August 2025 at Microsoft Office, Gurugram.',
    tech: ['Microsoft', 'MLSA', 'Hackathon'],
    image: triwizardathonCert,
  },
  {
    id: '9',
    title: 'Artificial Intelligence Upskilling Course',
    category: 'certificate',
    description: 'Certificate of Course Completion from My Job Grow. Successfully completed the Artificial Intelligence Upskilling Course in January 2025, comprising 15 hours of learning and training.',
    tech: ['AI', 'Machine Learning', 'My Job Grow'],
    image: myJobGrowAICert,
  },
  {
    id: '10',
    title: 'AI Internship - IIT Bombay Techfest',
    category: 'certificate',
    description: 'Certificate of Internship Completion from My Job Grow in collaboration with IIT Bombay Techfest. Issued for outstanding achievement in Artificial Intelligence, recognizing successful completion of an internship and advanced projects.',
    tech: ['AI', 'IIT Bombay', 'Techfest', 'Internship'],
    image: myJobGrowInternCert,
  },
];

const categories = [
  { id: 'all', name: 'All', icon: Globe },
  { id: 'website', name: 'Websites', icon: Globe },
  { id: 'video', name: 'Videos', icon: Play },
  { id: 'certificate', name: 'Certificates', icon: Award },
];

interface DisplayProject {
  id: string;
  title: string;
  category: 'video' | 'website' | 'certificate';
  description: string;
  image?: string;
  link?: string;
  repo_url?: string;
  tech?: string[];
}

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<DisplayProject | null>(null);
  
  // Fetch dynamic content from database
  const { content: dbContent, isLoading } = usePortfolioContent(false);

  // Convert database content to display format and merge with legacy
  const projects: DisplayProject[] = dbContent.length > 0 
    ? dbContent.map((item: PortfolioContent) => ({
        id: item.id,
        title: item.title,
        category: item.type,
        description: item.description || '',
        image: item.media_url || undefined,
        link: item.external_link || undefined,
        repo_url: item.repo_url || undefined,
        tech: item.tags || undefined,
      }))
    : legacyProjects;

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.project-card', { opacity: 1, y: 0 });
      
      gsap.from('.project-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'website': return <Globe className="w-4 h-4" />;
      case 'certificate': return <Award className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <section 
      id="projects"
      ref={sectionRef}
      className="min-h-screen py-24 relative gradient-section-1"
    >
      <div className="absolute inset-0 studio-light opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm text-foreground/90 tracking-widest uppercase font-medium">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-light hero-text mt-2 text-foreground">My Projects</h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all duration-300 clickable backdrop-blur-sm ${
                activeCategory === cat.id
                  ? 'bg-background/30 text-foreground border border-foreground/40'
                  : 'bg-background/10 text-foreground/70 hover:bg-background/20 border border-foreground/20'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && (
          <div className="projects-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg">No projects available in this category yet.</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="project-card glass rounded-xl overflow-hidden text-left clickable group transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Project Image/Video/Placeholder */}
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-muted to-secondary">
                    {project.image ? (
                      project.category === 'video' && isVideoUrl(project.image) ? (
                        <video
                          src={project.image}
                          controls
                          controlsList="nodownload"
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-primary/50 group-hover:scale-110 transition-transform duration-500">
                          {getCategoryIcon(project.category)}
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs bg-background/80 backdrop-blur-sm border border-border/50 flex items-center gap-1.5">
                      {getCategoryIcon(project.category)}
                      <span className="capitalize">{project.category}</span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Project Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    {project.tech && (
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span 
                            key={tech}
                            className="px-2 py-1 rounded text-xs bg-muted/50 text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div className="fixed inset-0 bg-background/95 backdrop-blur-md" />
          
          {/* Close Button */}
          <button
            onClick={() => setSelectedProject(null)}
            className="fixed top-4 right-4 z-[60] p-3 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-colors clickable"
          >
            <X size={24} className="text-black" />
          </button>
          
          {/* Certificate Full View */}
          {selectedProject.category === 'certificate' && selectedProject.image ? (
            <div 
              className="relative z-10 min-h-full w-full flex flex-col items-center py-16 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-5xl mb-6">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-auto rounded-lg shadow-2xl shadow-primary/10"
                />
              </div>

              <div className="w-full max-w-2xl glass rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground uppercase tracking-wide">Certificate</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold hero-text mb-2">{selectedProject.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{selectedProject.description}</p>
                
                {selectedProject.tech && (
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs bg-primary/10 text-foreground border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative z-10 min-h-full w-full flex items-center justify-center p-4">
              <div 
                className="glass rounded-2xl overflow-hidden max-w-lg w-full animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-video relative bg-gradient-to-br from-muted to-secondary overflow-hidden">
                  {selectedProject.image ? (
                    selectedProject.category === 'video' && isVideoUrl(selectedProject.image) ? (
                      <video
                        src={selectedProject.image}
                        controls
                        controlsList="nodownload"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl text-primary/30">
                        {getCategoryIcon(selectedProject.category)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(selectedProject.category)}
                    <span className="text-sm text-muted-foreground capitalize">{selectedProject.category}</span>
                  </div>
                  <h3 className="text-2xl font-semibold hero-text mb-3">{selectedProject.title}</h3>
                  <p className="text-muted-foreground mb-6">{selectedProject.description}</p>

                  {selectedProject.tech && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedProject.tech.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1.5 rounded-full text-sm bg-primary/10 text-foreground border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {(selectedProject.link || selectedProject.repo_url) && (
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.link && (
                        <a
                          href={selectedProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 text-foreground hover:bg-primary/30 transition-colors clickable text-sm font-medium"
                        >
                          Live Website
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {selectedProject.repo_url && (
                        <a
                          href={selectedProject.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/80 text-foreground hover:bg-secondary border border-border/50 transition-colors clickable text-sm font-medium"
                        >
                          GitHub Repo
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
