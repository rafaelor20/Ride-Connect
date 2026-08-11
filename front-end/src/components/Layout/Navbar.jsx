import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Car, 
  MapPin, 
  History, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import UserContext from '../../contexts/UserContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userData, setUserData } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserData({});
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('rideEstimate');
    localStorage.removeItem('rideConfirm');
    localStorage.removeItem('origin');
    localStorage.removeItem('destination');
    navigate('/');
  };

  const navItems = [
    { label: 'Início', path: '/home', icon: Car },
    { label: 'Nova Viagem', path: '/estimate', icon: MapPin },
    { label: 'Histórico', path: '/rides', icon: History },
  ];

  const userName = userData?.user?.name || userData?.name || 'Passageiro';

  return (
    <NavContainer>
      <NavInner>
        {/* Brand Logo */}
        <BrandLink to="/home" onClick={() => setMobileMenuOpen(false)}>
          <LogoBadge>
            <Car size={22} color="#ffffff" strokeWidth={2.5} />
          </LogoBadge>
          <BrandText>
            Ride<span>Connect</span>
          </BrandText>
        </BrandLink>

        {/* Desktop Navigation Links */}
        <DesktopNav>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/rides' && location.pathname === '/rides-by-driver') ||
              (item.path === '/estimate' && (location.pathname === '/choose-driver' || location.pathname === '/confirm'));
            return (
              <NavLink key={item.path} to={item.path} $active={isActive}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </DesktopNav>

        {/* Right side user + logout */}
        <UserSection>
          <UserProfileBadge>
            <UserIconWrapper>
              <User size={16} />
            </UserIconWrapper>
            <UserNameText>{userName}</UserNameText>
          </UserProfileBadge>

          <LogoutButton onClick={handleLogout} title="Sair da conta">
            <LogOut size={18} />
            <LogoutLabel>Sair</LogoutLabel>
          </LogoutButton>

          {/* Mobile Menu Toggle Button */}
          <MobileToggleBtn 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileToggleBtn>
        </UserSection>
      </NavInner>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <MobileMenuOverlay onClick={() => setMobileMenuOpen(false)}>
          <MobileMenuDrawer onClick={(e) => e.stopPropagation()}>
            <MobileUserCard>
              <UserIconWrapperLarge>
                <User size={24} />
              </UserIconWrapperLarge>
              <div>
                <MobileUserName>{userName}</MobileUserName>
                <MobileUserStatus>Conta Ativa</MobileUserStatus>
              </div>
            </MobileUserCard>

            <MobileNavList>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                  (item.path === '/rides' && location.pathname === '/rides-by-driver') ||
                  (item.path === '/estimate' && (location.pathname === '/choose-driver' || location.pathname === '/confirm'));
                return (
                  <MobileNavLink 
                    key={item.path} 
                    to={item.path} 
                    $active={isActive}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={18} opacity={0.6} />
                  </MobileNavLink>
                );
              })}
            </MobileNavList>

            <MobileLogoutBtn onClick={handleLogout}>
              <LogOut size={18} />
              <span>Sair da conta</span>
            </MobileLogoutBtn>
          </MobileMenuDrawer>
        </MobileMenuOverlay>
      )}
    </NavContainer>
  );
}

// Styled Components for Navbar
const NavContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-xs);
`;

const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    padding: 0.85rem 1.5rem;
  }
`;

const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
`;

const LogoBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
  transition: transform var(--transition-fast);

  &:hover {
    transform: scale(1.05);
  }
`;

const BrandText = styled.span`
  font-family: var(--font-family-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.03em;

  span {
    color: var(--color-primary);
  }
`;

const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.925rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
  color: ${(props) => (props.$active ? 'var(--color-primary)' : 'var(--text-secondary)')};
  background-color: ${(props) => (props.$active ? 'var(--color-primary-light)' : 'transparent')};

  &:hover {
    color: var(--color-primary);
    background-color: var(--color-primary-light);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserProfileBadge = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background-color: var(--bg-surface-secondary);
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);

  @media (min-width: 640px) {
    display: flex;
  }
`;

const UserIconWrapper = styled.div`
  width: 26px;
  height: 26px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserNameText = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoutButton = styled.button`
  display: none;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-md);
  background-color: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  font-size: 0.875rem;

  &:hover {
    color: var(--color-danger);
    border-color: var(--color-danger-border);
    background-color: var(--color-danger-bg);
  }

  @media (min-width: 640px) {
    display: flex;
  }
`;

const LogoutLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
`;

const MobileToggleBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: var(--radius-md);
  background-color: var(--bg-surface-secondary);
  color: var(--text-main);
  border: 1px solid var(--border-color);

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  top: 65px;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 40;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.2s ease-out;
`;

const MobileMenuDrawer = styled.div`
  width: 80%;
  max-width: 320px;
  height: calc(100vh - 65px);
  background-color: var(--bg-surface);
  border-left: 1px solid var(--border-color);
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
`;

const MobileUserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: var(--bg-surface-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
`;

const UserIconWrapperLarge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileUserName = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
`;

const MobileUserStatus = styled.p`
  font-size: 0.8rem;
  color: var(--color-success);
  font-weight: 500;
  margin: 0;
`;

const MobileNavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => (props.$active ? 'var(--color-primary)' : 'var(--text-main)')};
  background-color: ${(props) => (props.$active ? 'var(--color-primary-light)' : 'transparent')};

  &:hover {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
  }
`;

const MobileLogoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem;
  border-radius: var(--radius-md);
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
  border: 1px solid var(--color-danger-border);
  font-weight: 600;
  margin-top: auto;

  &:hover {
    background-color: var(--color-danger);
    color: #ffffff;
  }
`;
