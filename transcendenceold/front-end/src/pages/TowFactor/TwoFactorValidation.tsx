import React, { useEffect } from 'react'

import "./TwoFactorValidationStyle.css"
import TowFactorForm from './TowFactorForm/TowFactorForm'
import Header from '../../components/Header/Header'
import { useConnectedUser } from '../../context/ConnectedContext'
import { UserType } from '../../types'
import { generateTowFactorQrCode, prepareUrl } from '../../utils/utils'
import { useNavigate } from 'react-router-dom'

function TwoFactorValidation() {

    const { connectedUser, setConnectedUser } = useConnectedUser();

    const navigate = useNavigate();

    useEffect(() => {

        initData();

    }, [setConnectedUser])

    const initData = async () => {
        const userData: UserType | null = await generateTowFactorQrCode();

        if (!userData) {
            navigate("/error-page/:401")
        } else {
            setConnectedUser(userData)
        }
    }

  return (
    <>
        {/* <Header isConnected={true} /> */}
        <section className="two-factor-validation-section container">
            <div className="two-factor-validation-content">
                <div className="two-factor-validation-header">
                    <div className="two-factor-validation-title">
                        Two Factor Validation
                    </div>
                </div>
                <div className="two-factor-validation-body">
                    <div className="qr-code-image">
                        <img src={prepareUrl("") + connectedUser?.qrCodeFileName} alt="QR code" />
                    </div>
                    <TowFactorForm />
                </div>
            </div>
        </section>
    
    </>


  )
}

export default TwoFactorValidation
