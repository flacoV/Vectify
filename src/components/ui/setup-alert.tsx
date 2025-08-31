'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Info, X, Copy, ExternalLink } from 'lucide-react'
import { checkSupabaseSetup, getSetupInstructions } from '@/lib/supabase-setup-check'

export function SetupAlert() {
  const [setupStatus, setSetupStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    checkSetup()
  }, [])

  const checkSetup = async () => {
    try {
      const status = await checkSupabaseSetup()
      setSetupStatus(status)
    } catch (error) {
      console.error('Error checking setup:', error)
      setSetupStatus({
        issues: ['Error al verificar la configuración'],
        warnings: [],
        isConfigured: false,
        hasWarnings: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (isLoading) {
    return null
  }

  if (setupStatus?.isConfigured && !setupStatus?.hasWarnings) {
    return null
  }

  const instructions = getSetupInstructions()

  return (
    <div className="mb-6">
      {setupStatus?.issues.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Configuración de Supabase Requerida
              </h3>
              <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {setupStatus.issues.map((issue: string, index: number) => (
                  <p key={index}>• {issue}</p>
                ))}
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-3 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium"
              >
                {showDetails ? 'Ocultar instrucciones' : 'Ver instrucciones de configuración'}
              </button>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="ml-2 text-red-400 hover:text-red-600 dark:hover:text-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {setupStatus?.warnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Advertencias de Configuración
              </h3>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {setupStatus.warnings.map((warning: string, index: number) => (
                  <p key={index}>• {warning}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                {instructions.title}
              </h3>
              <div className="space-y-4">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="text-sm">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 mb-2">
                      {step.description}
                    </p>
                    {step.steps && (
                      <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1 ml-2">
                        {step.steps.map((subStep, subIndex) => (
                          <li key={subIndex}>{subStep}</li>
                        ))}
                      </ul>
                    )}
                    {step.code && (
                      <div className="relative">
                        <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-xs overflow-x-auto">
                          <code>{step.code}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(step.code)}
                          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-700">
                <a
                  href="https://supabase.com/docs/guides/getting-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  Documentación de Supabase
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
