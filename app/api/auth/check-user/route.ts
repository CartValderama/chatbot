import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // First, try to find a patient in the users table
    const { data: patients, error: patientError } = await db
      .from('users')
      .select(`
        user_id,
        first_name,
        last_name,
        email,
        phone,
        birth_date,
        gender,
        address
      `)
      .eq('email', email);

    if (!patientError && patients && patients.length > 0) {
      const patient = patients[0];
      return NextResponse.json({
        user: {
          id: patient.user_id,
          email: patient.email,
          firstName: patient.first_name,
          lastName: patient.last_name,
          name: `${patient.first_name} ${patient.last_name}`,
          userType: 'Elder',
          phone: patient.phone,
          birthDate: patient.birth_date,
          gender: patient.gender,
          address: patient.address,
        },
      });
    }

    // If not found in users, try to find a doctor in the doctors table
    const { data: doctors, error: doctorError } = await db
      .from('doctors')
      .select(`
        doctor_id,
        name,
        email,
        speciality,
        phone,
        hospital
      `)
      .eq('email', email);

    if (!doctorError && doctors && doctors.length > 0) {
      const doctor = doctors[0];
      // Parse doctor name (assuming format "Dr. FirstName LastName")
      const nameParts = doctor.name.split(' ');
      const firstName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : doctor.name;
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

      return NextResponse.json({
        user: {
          id: doctor.doctor_id,
          email: doctor.email,
          firstName: firstName,
          lastName: lastName,
          name: doctor.name,
          userType: 'Doctor',
          phone: doctor.phone,
          speciality: doctor.speciality,
          hospital: doctor.hospital,
        },
      });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
