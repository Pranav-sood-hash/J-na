import { PortfolioContent } from '@/hooks/usePortfolioContent';
import { supabase } from '@/integrations/supabase/client';

// Import certificate images
import awsCert from '@/assets/certificates/aws-solutions-architecture.png';
import kaggleCert from '@/assets/certificates/kaggle-vampire.png';
import oracleCert from '@/assets/certificates/oracle-ai-foundations.png';
import hackUPCert from '@/assets/certificates/hack-uttarpradesh.png';
import googleCloudCert from '@/assets/certificates/google-cloud-agentic-ai.png';
import triwizardathonCert from '@/assets/certificates/triwizardathon.png';
import myJobGrowAICert from '@/assets/certificates/myjobgrow-ai-course.png';
import myJobGrowInternCert from '@/assets/certificates/myjobgrow-techfest-internship.png';

const existingCertificates: Omit<PortfolioContent, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    type: 'certificate',
    title: 'AWS Solutions Architecture Job Simulation',
    description: 'Certificate of Completion from AWS & Forage. Completed practical tasks in designing a simple, scalable, hosting architecture over October to November 2025.',
    media_url: awsCert,
    external_link: '',
    tags: ['AWS', 'Cloud Architecture', 'Forage'],
    is_visible: true,
  },
  {
    type: 'certificate',
    title: 'Kaggle Vampire Badge',
    description: 'Badge Certificate from Kaggle. Successfully earned the Vampire badge on Kaggle platform.',
    media_url: kaggleCert,
    external_link: '',
    tags: ['Kaggle', 'Data Science'],
    is_visible: true,
  },
  {
    type: 'certificate',
    title: 'Oracle Certified Foundations Associate',
    description: 'Certificate of Recognition from Oracle University. Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate. Recognized by Oracle Corporation as Oracle Certified.',
    media_url: oracleCert,
    external_link: '',
    tags: ['Oracle', 'AI', 'Cloud Infrastructure'],
    is_visible: true,
  },
  {
    type: 'certificate',
    title: 'Hack with UttarPradesh 2025',
    description: 'Certificate of Participation. Actively participated in Hack with UttarPradesh 2025, held on 1st & 2nd November, contributing to innovation, collaboration, & problem-solving. Presented by Chandigarh University Technology Business Incubator.',
    media_url: hackUPCert,
    external_link: '',
    tags: ['Hackathon', 'Innovation', 'Problem Solving'],
    is_visible: true,
  },
  {
    type: 'certificate',
    title: 'Google Cloud Agentic AI Day',
    description: 'Certificate of Participation from Google Cloud & Hack2skill. Recognized for initiative and contribution to the Agentic AI Day, joining a community of changemakers harnessing Agentic AI to address real-world problems.',
    media_url: googleCloudCert,
    external_link: '',
    tags: ['Google Cloud', 'Agentic AI', 'Hack2skill'],
    is_visible: true,
  },
  {
    type: 'certificate',
    title: 'Triwizardathon 1.0 Finalist',
    description: 'Certificate of Participation for successfully qualifying for the Finale Round of Triwizardathon 1.0 organized by Microsoft Learn Student Ambassador - GLA University Chapter, held on 2nd August 2025 at Microsoft Office, Gurugram.',
    media_url: triwizardathonCert,
    external_link: '',
    tags: ['Microsoft', 'MLSA', 'Hackathon'],
    is_visible: true,
  },
  {
    type: 'certificate',
    title: 'Artificial Intelligence Upskilling Course',
    description: 'Certificate of Course Completion from My Job Grow. Successfully completed the Artificial Intelligence Upskilling Course in January 2025, comprising 15 hours of learning and training.',
    media_url: myJobGrowAICert,
    external_link: '',
    tags: ['AI', 'Machine Learning', 'My Job Grow'],
    is_visible: true,
  },
  {
    type: 'certificate',
    title: 'AI Internship - IIT Bombay Techfest',
    description: 'Certificate of Internship Completion from My Job Grow in collaboration with IIT Bombay Techfest. Issued for outstanding achievement in Artificial Intelligence, recognizing successful completion of an internship and advanced projects.',
    media_url: myJobGrowInternCert,
    external_link: '',
    tags: ['AI', 'IIT Bombay', 'Techfest', 'Internship'],
    is_visible: true,
  },
];

export const initializeCertificates = async () => {
  try {
    // Check if certificates already exist in Supabase
    const { data, error } = await supabase
      .from('portfolio_content')
      .select('*', { count: 'exact' });

    if (error) {
      console.warn('Could not check existing certificates:', error);
      return false;
    }

    // If no certificates exist, initialize with defaults
    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from('portfolio_content')
        .insert(existingCertificates);

      if (insertError) {
        console.warn('Could not initialize certificates:', insertError);
        return false;
      }

      console.log('Certificates initialized successfully');
      return true;
    }

    console.log('Certificates already exist');
    return false;
  } catch (err) {
    console.warn('Unexpected error in initializeCertificates:', err);
    return false;
  }
};
