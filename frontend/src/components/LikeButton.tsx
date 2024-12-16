// frontend/src/components/LikeButton.tsx

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import Cookies from 'js-cookie'; // 用來操作 Cookie
import { useApi } from '../core/useApi';

/**
 * Props for the LikeButton component.
 */
interface LikeButtonProps {
  programmeId: string; // Programme ID for the like API
  initialLikes: number; // Initial number of likes
}

/**
 * A reusable Like Button component with cooldown timer logic and feedback.
 *
 * @component
 * @example
 * <LikeButton programmeId="123" initialLikes={10} />
 */
const LikeButton: React.FC<LikeButtonProps> = ({ programmeId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes); // Current like count
  const [cooldown, setCooldown] = useState<number | null>(null); // Cooldown timer
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    variant: 'success' | 'danger';
  } | null>(null);
  const apiRequest = useApi();

  /**
   * On component load, check for existing cooldown from cookies.
   */
  useEffect(() => {
    const savedCooldown = Cookies.get(`like_cooldown_${programmeId}`);
    if (savedCooldown) {
      const cooldownEnd = parseInt(savedCooldown, 10); // Get the cooldown expiration time
      const remainingCooldown = cooldownEnd - Math.floor(Date.now() / 1000);
      if (remainingCooldown > 0) {
        setCooldown(remainingCooldown); // Set the remaining cooldown time
      } else {
        Cookies.remove(`like_cooldown_${programmeId}`); // Remove expired Cookie
      }
    }
  }, [programmeId]);

  /**
   * Handle the cooldown timer, decrement every second.
   */
  useEffect(() => {
    if (cooldown === null) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev && prev > 1) {
          return prev - 1;
        } else {
          Cookies.remove(`like_cooldown_${programmeId}`); // Remove expired Cookie
          return null;
        }
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up the timer
  }, [cooldown, programmeId]);

  /**
   * Handle Like button click.
   */
  const handleLike = async () => {
    if (cooldown) return; // Prevent multiple clicks during cooldown

    try {
      const response = await apiRequest(
        `/programme/${programmeId}/like`,
        { method: 'POST' },
        (data) => {
          setLikes(data.likes); // Update the like count
          setToastConfig({ message: 'Liked successfully! 🎉', variant: 'success' });

          const newCooldown = 30; // Cooldown duration in seconds
          const cooldownEnd = Math.floor(Date.now() / 1000) + newCooldown;

          // Save the cooldown expiration time in cookies
          Cookies.set(`like_cooldown_${programmeId}`, cooldownEnd.toString(), { expires: 1 / (24 * 60 * 60) * 30 }); // Expire in 30 seconds
          setCooldown(newCooldown); // Set cooldown in state
        },
        (error) => {
          if (error.cooldown) {
            setCooldown(error.cooldown);
            setToastConfig({
              message: `Please wait ${error.cooldown}s before liking again.`,
              variant: 'danger',
            });
          } else {
            setToastConfig({ message: error.message || 'An error occurred.', variant: 'danger' });
          }
        }
      );
    } catch (error) {
      console.error('Error liking programme:', error);
      setToastConfig({ message: 'Something went wrong.', variant: 'danger' });
    }
  };

  return (
    <div className="ms-auto" style={{ display: 'inline-flex', alignItems: 'center', float: 'right' }}>
      <button
        type="button"
        className="btn btn-info shadow text-light"
        onClick={handleLike}
        disabled={!!cooldown}
      >
        {cooldown ? (
          `(${cooldown}s)`
        ) : (
          <>
            Like <span className="h4 text-dark fw-bold">{likes}</span>&nbsp;👍
          </>
        )}
      </button>

      {/* Toast Feedback */}
      {toastConfig && (
        <Toast
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1050,
            backgroundColor:
              toastConfig.variant === 'success' ? '#d4edda' : '#f8d7da',
            color: toastConfig.variant === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${
              toastConfig.variant === 'success' ? '#c3e6cb' : '#f5c6cb'
            }`,
            borderRadius: '10px',
            padding: '10px 20px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          onClose={() => setToastConfig(null)}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-center">
            <strong>{toastConfig.message}</strong>
          </Toast.Body>
        </Toast>
      )}
    </div>
  );
};

export default LikeButton;
