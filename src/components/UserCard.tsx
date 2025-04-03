import {Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import {UserResponseDto} from "../types";
import { Email } from "@mui/icons-material";

interface UserCardProps {
    user: UserResponseDto;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const getInitials = (): string => {
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';

        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`;
        }

        if (firstName) {
            return firstName.charAt(0);
        }

        if (lastName) {
            return lastName.charAt(0);
        }

        return user.username.charAt(0).toUpperCase();
    };

    const getFullName = (): string => {
        return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
    };

    return (
        <Card sx={{ minWidth: 275, maxWidth: 345 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            mr: 2
                        }}
                    >
                        {getInitials()}
                    </Avatar>
                    <Box>
                        <Typography variant="h6">
                            {getFullName()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            @{user.username}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                        {user.email}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;

