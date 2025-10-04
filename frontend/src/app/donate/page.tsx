import DonationForm from '@/components/DonationForm';
import styles from './page.module.css';

export default function Donate() {
  return (
    <main className={styles.main}>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support Our Mission
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect I Network is dedicated to creating positive change in Dwarka Mor and surrounding communities. 
              Your donation helps us provide essential services, education, and support to those who need it most.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-700">Families Helped</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-700">Community Programs</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-700">Lives Impacted</div>
            </div>
          </div>

          {/* Donation Form */}
          <div className="mb-12">
            <DonationForm />
          </div>

          {/* How Your Money Helps */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How Your Donation Makes a Difference
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <span className="text-blue-600 text-xl">📚</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Education Support</h3>
                  <p className="text-gray-600">
                    ₹500 can provide school supplies for a child for an entire year
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 rounded-full p-3">
                  <span className="text-green-600 text-xl">🍽️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Meal Programs</h3>
                  <p className="text-gray-600">
                    ₹100 can provide nutritious meals for a family of four for a day
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <span className="text-purple-600 text-xl">🏥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Healthcare</h3>
                  <p className="text-gray-600">
                    ₹1000 can cover basic medical check-ups for 10 community members
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <span className="text-orange-600 text-xl">🛠️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Skill Development</h3>
                  <p className="text-gray-600">
                    ₹2000 can fund vocational training for one person for a month
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Have questions about your donation? 
              <br />
              Contact us at{' '}
              <a href="mailto:donate@connectinetwork.org" className="text-blue-600 hover:underline">
                donate@connectinetwork.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
