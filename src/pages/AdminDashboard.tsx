import { Award, Play, Globe } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ContentCard from '@/components/admin/ContentCard';
import awsCert from '@/assets/certificates/aws-solutions-architecture.png';
import kaggleCert from '@/assets/certificates/kaggle-vampire.png';
import oracleCert from '@/assets/certificates/oracle-ai-foundations.png';
import hackUPCert from '@/assets/certificates/hack-uttarpradesh.png';
import googleCloudCert from '@/assets/certificates/google-cloud-agentic-ai.png';
import triwizardathonCert from '@/assets/certificates/triwizardathon.png';
import myJobGrowAICert from '@/assets/certificates/myjobgrow-ai-course.png';
import myJobGrowInternCert from '@/assets/certificates/myjobgrow-techfest-internship.png';

interface PortfolioContent {
  id: string;
  type: 'certificate' | 'video' | 'website';
  title: string;
  description: string | null;
  media_url: string | null;
  external_link: string | null;
  tags: string[] | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const staticCertificates: PortfolioContent[] = [
  {
    id: '1',
    type: 'certificate',
    title: 'AWS Solutions Architecture Job Simulation',
    description: 'Certificate of Completion from AWS & Forage. Completed practical tasks in designing a simple, scalable, hosting architecture over October to November 2025.',
    media_url: awsCert,
    external_link: '',
    tags: ['AWS', 'Cloud Architecture', 'Forage'],
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'certificate',
    title: 'Kaggle Vampire Badge',
    description: 'Badge Certificate from Kaggle. Successfully earned the Vampire badge on Kaggle platform.',
    media_url: kaggleCert,
    external_link: '',
    tags: ['Kaggle', 'Data Science'],
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'certificate',
    title: 'Oracle Certified Foundations Associate',
    description: 'Certificate of Recognition from Oracle University. Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate. Recognized by Oracle Corporation as Oracle Certified.',
    media_url: oracleCert,
    external_link: '',
    tags: ['Oracle', 'AI', 'Cloud Infrastructure'],
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'certificate',
    title: 'Hack with UttarPradesh 2025',
    description: 'Certificate of Participation. Actively participated in Hack with UttarPradesh 2025, held on 1st & 2nd November, contributing to innovation, collaboration, & problem-solving. Presented by Chandigarh University Technology Business Incubator.',
    media_url: hackUPCert,
    external_link: '',
    tags: ['Hackathon', 'Innovation', 'Problem Solving'],
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    type: 'certificate',
    title: 'Google Cloud Agentic AI Day',
    description: 'Certificate of Participation from Google Cloud & Hack2skill. Recognized for initiative and contribution to the Agentic AI Day, joining a community of changemakers harnessing Agentic AI to address real-world problems.',
    media_url: googleCloudCert,
    external_link: '',
    tags: ['Google Cloud', 'Agentic AI', 'Hack2skill'],
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    type: 'certificate',
    title: 'Triwizardathon 1.0 Finalist',
    description: 'Certificate of Participation for successfully qualifying for the Finale Round of Triwizardathon 1.0 organized by Microsoft Learn Student Ambassador - GLA University Chapter, held on 2nd August 2025 at Microsoft Office, Gurugram.',
    media_url: triwizardathonCert,
    external_link: '',
    tags: ['Microsoft', 'MLSA', 'Hackathon'],
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    type: 'certificate',
    title: 'Artificial Intelligence Upskilling Course',
    description: 'Certificate of Course Completion from My Job Grow. Successfully completed the Artificial Intelligence Upskilling Course in January 2025, comprising 15 hours of learning and training.',
    media_url: myJobGrowAICert,
    external_link: '',
    tags: ['AI', 'Machine Learning', 'My Job Grow'],
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    type: 'certificate',
    title: 'AI Internship - IIT Bombay Techfest',
    description: 'Certificate of Internship Completion from My Job Grow in collaboration with IIT Bombay Techfest. Issued for outstanding achievement in Artificial Intelligence, recognizing successful completion of an internship and advanced projects.',
    media_url: myJobGrowInternCert,
    external_link: '',
    tags: ['AI', 'IIT Bombay', 'Techfest', 'Internship'],
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const contentTypes = [
  { id: 'certificate', name: 'Certificates', icon: Award },
  { id: 'video', name: 'Videos', icon: Play },
  { id: 'website', name: 'Websites', icon: Globe },
] as const;

const AdminDashboard = () => {
  const content = staticCertificates;

  const getContentByType = (type: string) => {
    return content.filter(item => item.type === type);
  };

  const handleEdit = (item: PortfolioContent) => {
    console.log('Edit not implemented - static data only', item);
  };

  const handleDelete = (id: string) => {
    console.log('Delete not implemented - static data only', id);
  };

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    console.log('Toggle visibility not implemented - static data only', id, isVisible);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your portfolio content. Total items: {content.length}
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        {contentTypes.map(({ id, name, icon: Icon }) => {
          const items = getContentByType(id);

          return (
            <section key={id}>
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{name}</h2>
                  <p className="text-sm text-muted-foreground">{items.length} items</p>
                </div>
              </div>

              {/* Content Grid */}
              {items.length === 0 ? (
                <div className="bg-muted/30 border border-dashed border-border rounded-xl p-8 text-center">
                  <Icon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No {name.toLowerCase()} available.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <ContentCard
                      key={item.id}
                      content={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
