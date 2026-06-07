'use client'

import { useState } from 'react'
import { updateProfile } from './actions'

type Profile = {
  first_name: string | null
  last_name: string | null
  badge_number: string | null
  pledge_class: string | null
  email: string | null
  phone: string | null
  address_street: string | null
  address_city: string | null
  address_state: string | null
  address_zip: string | null
  graduation_year: number | null
  employer: string | null
  occupation: string | null
  bio: string | null
}

function ReadField({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</dt>
      <dd className="text-white mt-0.5 text-sm">
        {value ?? <span className="text-gray-600 italic">Not set</span>}
      </dd>
    </div>
  )
}

function FormField({
  label, name, defaultValue, type = 'text', placeholder, colSpan,
}: {
  label: string; name: string; defaultValue?: string | number | null
  type?: string; placeholder?: string; colSpan?: boolean
}) {
  return (
    <div className={colSpan ? 'col-span-2' : ''}>
      <label htmlFor={name} className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
      />
    </div>
  )
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [editing, setEditing] = useState(!profile?.first_name)

  if (!editing) {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-kp-gold font-bold text-lg">Profile Information</h2>
          <button
            onClick={() => setEditing(true)}
            className="bg-kp-blue text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-kp-blue-light transition-colors"
          >
            Edit Profile
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
          <ReadField label="First Name" value={profile?.first_name ?? null} />
          <ReadField label="Last Name" value={profile?.last_name ?? null} />
          <ReadField label="Badge Number" value={profile?.badge_number ?? null} />
          <ReadField label="Pledge Class" value={profile?.pledge_class ?? null} />
          <ReadField label="Email" value={profile?.email ?? null} />
          <ReadField label="Phone" value={profile?.phone ?? null} />
          <ReadField label="Graduation Year" value={profile?.graduation_year ?? null} />
          <ReadField label="Employer" value={profile?.employer ?? null} />
          <ReadField label="Occupation" value={profile?.occupation ?? null} />
          <div className="col-span-2">
            <ReadField
              label="Address"
              value={
                [profile?.address_street, profile?.address_city, profile?.address_state, profile?.address_zip]
                  .filter(Boolean).join(', ') || null
              }
            />
          </div>
          {profile?.bio && (
            <div className="col-span-2">
              <ReadField label="Bio / Notes" value={profile.bio} />
            </div>
          )}
        </dl>
      </>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-kp-gold font-bold text-lg">Edit Profile</h2>
        {profile?.first_name && (
          <button
            onClick={() => setEditing(false)}
            className="border border-kp-border text-gray-400 px-4 py-2 rounded-lg text-sm hover:border-gray-500 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <form action={updateProfile} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name *" name="first_name" defaultValue={profile?.first_name} />
          <FormField label="Last Name *" name="last_name" defaultValue={profile?.last_name} />
          <FormField label="Badge Number" name="badge_number" defaultValue={profile?.badge_number} placeholder="e.g. Alpha Omicron" />
          <FormField label="Pledge Class" name="pledge_class" defaultValue={profile?.pledge_class} placeholder="e.g. Gamma Kappa" />
          <FormField label="Email" name="email" type="email" defaultValue={profile?.email} />
          <FormField label="Phone" name="phone" type="tel" defaultValue={profile?.phone} />
          <FormField label="Graduation Year" name="graduation_year" type="number" defaultValue={profile?.graduation_year} placeholder="e.g. 2005" />
          <FormField label="Employer" name="employer" defaultValue={profile?.employer} />
          <FormField label="Occupation / Title" name="occupation" defaultValue={profile?.occupation} colSpan />
        </div>

        <div>
          <div className="text-xs font-semibold text-kp-gold uppercase tracking-wider mb-3">Address</div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Street" name="address_street" defaultValue={profile?.address_street} colSpan />
            <FormField label="City" name="address_city" defaultValue={profile?.address_city} />
            <div className="grid grid-cols-2 gap-3">
              <FormField label="State" name="address_state" defaultValue={profile?.address_state} placeholder="MO" />
              <FormField label="ZIP" name="address_zip" defaultValue={profile?.address_zip} />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-1.5">
            Bio / Notes
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={profile?.bio ?? ''}
            className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
            placeholder="Share what you've been up to since graduation..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-kp-gold text-black font-bold px-7 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            Save Changes
          </button>
          {profile?.first_name && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="border border-kp-border text-gray-400 px-7 py-3 rounded-xl text-sm hover:border-gray-500 hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  )
}
